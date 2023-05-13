package it.polimi.tiw.playlist.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.UnavailableException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import it.polimi.tiw.playlist.dao.PlaylistDAO;
import it.polimi.tiw.playlist.dao.SongDAO;
import it.polimi.tiw.playlist.utils.ConnectionHandler;
import it.polimi.tiw.playlist.utils.FromJsonToArray;

@WebServlet("/EditSorting")
@MultipartConfig
public class EditSortingServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private Connection connection;
	
	public EditSortingServlet() {
		super();
	}
	
	public void init() throws ServletException{
		try {
			ServletContext context = getServletContext();
			this.connection = ConnectionHandler.getConnection(context);
			
		} catch (UnavailableException  e) {
			
		}
	}

	public void doPost(HttpServletRequest request , HttpServletResponse response)throws ServletException,IOException{
		HttpSession session = request.getSession(true);
		SongDAO songDAO = new SongDAO(this.connection);
		PlaylistDAO playlistDAO = new PlaylistDAO(this.connection);
		String userName = (String)session.getAttribute("user");
		
		//checking whether playlistName parameter is valid or not
		String playlistName = request.getParameter("playlistName");
		
		if(playlistName == null || playlistName.isEmpty()) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);//Code 400	
			response.getWriter().println("PlayList not found");
			return;
		}
		
		try {
			if( !(playlistDAO.belongTo(playlistName,userName)) ) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);//Code 400	
				response.getWriter().println("Playlist not found");
				return;
			}
		}
		catch(SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);//Code 500
			response.getWriter().println("Database error, try again");
			return;
		}
		
	    StringBuffer jb = new StringBuffer();
	    //Read the body of the request
	    try {
		    String line = null;
	        BufferedReader reader = request.getReader();
	        while ((line = reader.readLine()) != null) {
		       jb.append(line); 
	        }
	    } catch (Exception e) { 
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);//Code 500	
			response.getWriter().println("Error reading the request body, retry later");
			return;
	    }
	    
		//Create the jSon with the sorting
		Gson gSon = new GsonBuilder().create();
		String newSorting = gSon.toJson(jb);
		
		if(newSorting == null || newSorting.length() <= 1) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);//Code 400	
			response.getWriter().println("Add more songs to order you playlist!");
			return;
		}
		
		//Convert the String array in an arrayList of integer in order to make some checks
		ArrayList<Integer> sortedArray = FromJsonToArray.fromJsonToArrayList(newSorting);
		
		//Delete duplicates of the same song
		for(int i = 0 ; i < sortedArray.size() ; i++) {
			for(int j = i + 1 ; j < sortedArray.size() ; j++) {
				if(sortedArray.get(j) == sortedArray.get(i)) {
					sortedArray.remove(j);
				}
			}
		}
		
		
		//Delete songs that do not belong to the user
		for(Integer songId : sortedArray) {
			try {
				if( !(songDAO.belongTo(songId, userName)) ){
					sortedArray.remove(songId);
				}
			}catch(SQLException e) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);//Code 500
				response.getWriter().println("Database error, try again");
				return;
			}
		}
		
		//Re-convert the arrayList of integer in the String to upload
		newSorting = gSon.toJson(sortedArray);
		
		try {			
			if( !(playlistDAO.editSorting(newSorting,playlistName,userName)) ) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);//Code 500
				response.getWriter().println("Internal server error, retry later");
				return;
			}
		}catch(SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);//Code 500
			response.getWriter().println("Database error, try again");
			return;
		}	
		
		response.setStatus(HttpServletResponse.SC_OK);//Code 200
	}
	
	public void destroy() {
	      ConnectionHandler.destroy(this.connection);
	}
	
}