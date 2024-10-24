Instructions to Run the Application
Download the Code:

Begin by downloading the project files from the repository.
Open the Solution:

Launch Visual Studio and open the downloaded solution file.
Update Dependencies:

Ensure that all npm packages are up to date. To do this, open a terminal within Visual Studio and run the following command:
bash

npm install

Configure Database Connection:

The application handles the creation and seeding of database tables using Microsoft SQL Server. To set up the database connection, open the appsettings.json file and update the ConnectionString section as follows:
json

"ConnectionStrings": {
  "DefaultConnection": "Add Connection String Here"
}

Configure Startup Settings:

Right-click on the solution in the Solution Explorer and select "Properties."
In the properties window, navigate to the "Startup Project" section.
Choose "Multiple startup projects."
Set the server project to "Start" first, ensuring that the action for both projects is set to "Start."
Run the Application:

Press F5 or click on the "Start" button to launch the application.
By following these steps, you will successfully run the application in your local environment.
