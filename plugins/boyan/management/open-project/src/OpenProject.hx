package ;
import haxe.Serializer;
import haxe.Unserializer;
import js.Browser;
import js.html.TextAreaElement;

/**
 * ...
 * @author AS3Boyan
 */
class OpenProject
{

	public function new() 
	{
		
	}
	
	public static function openProject(?pathToProject:String):Void
	{
		if (pathToProject == null)
		{
			FileDialog.openFile(parseProject);
		}
		else 
		{
			checkIfFileExists(pathToProject);
		}
	}
	
	private static function checkIfFileExists(path:String):Void
	{
		js.Node.fs.exists(path, function (exists:Bool)
		{
			if (exists) 
			{
				parseProject(path);
			}
		}
		);
	}
	
	private static function parseProject(path:String):Void
	{				
		var filename:String = js.Node.path.basename(path);
			
		switch (filename) 
		{
			case "project.hide":					
				js.Node.fs.readFile(path, js.Node.NodeC.UTF8, function (error:js.Node.NodeErr, data:String):Void
				{
					var pathToProject:String = js.Node.path.dirname(path);
					//js.Node.process.chdir(pathToProject);
					
					ProjectAccess.currentProject = Unserializer.run(data);
					
					ProjectAccess.currentProject.path = pathToProject;
					FileTree.load(ProjectAccess.currentProject.name, pathToProject);
					
					var textarea:TextAreaElement = cast(Browser.document.getElementById("project-options-textarea"), TextAreaElement);
					textarea.value = ProjectAccess.currentProject.args.join("\n");
					
					Browser.getLocalStorage().setItem("pathToLastProject", "project.hide");
				}
				);
			case "project.xml", "application.xml":
				var pathToProject:String = js.Node.path.dirname(path);
				
				var project:Project = new Project();
				project.name = pathToProject.substr(pathToProject.lastIndexOf(js.Node.path.sep));
				project.type = Project.OPENFL;
				project.path = pathToProject;
				
				OpenFLTools.getParams(pathToProject, "flash", function (stdout:String)
				{				
					var textarea:TextAreaElement = cast(Browser.document.getElementById("project-options-textarea"), TextAreaElement);
					
					var args:Array<String> = [];
				
					var currentLine:String;
					
					for (line in stdout.split("\n"))
					{
						currentLine = StringTools.trim(line);
						
						if (!StringTools.startsWith(currentLine, "#"))
						{
							args.push(currentLine);
						}
					}
					
					textarea.value = args.join("\n");
					project.args = args;
					
					js.Node.fs.writeFile(path, Serializer.run(project), js.Node.NodeC.UTF8, function (error:js.Node.NodeErr)
					{
						FileTree.load(project.name, pathToProject);
					}
					);
				}
				);
				
				ProjectAccess.currentProject = project;
				
				Browser.getLocalStorage().setItem("pathToLastProject", js.Node.path.join(pathToProject, "project.hide"));
			default:				
				var extension:String = js.Node.path.extname(filename);
		
				switch (extension) 
				{
					case ".hxml":
						js.Node.fs.readFile(path, js.Node.NodeC.UTF8, function (error:js.Node.NodeErr, data:String)
						{
							var pathToProject:String = js.Node.path.dirname(path);
				
							var project:Project = new Project();
							project.name = pathToProject.substr(pathToProject.lastIndexOf(js.Node.path.sep));
							project.type = Project.HAXE;
							project.args = data.split("\n");
							
							ProjectAccess.currentProject = project;
							
							var textarea:TextAreaElement = cast(Browser.document.getElementById("project-options-textarea"), TextAreaElement);
							textarea.value = project.args.join("\n");
							
							js.Node.fs.writeFile(path, Serializer.run(project), js.Node.NodeC.UTF8, function (error:js.Node.NodeErr)
							{
								FileTree.load(project.name, pathToProject);
							}
							);
							
							Browser.getLocalStorage().setItem("pathToLastProject", js.Node.path.join(pathToProject, "project.hide"));
						}
						);
					//case ".hx":
						//
					//case ".xml":
						//
					default:
						TabManager.openFileInNewTab(path);
				}
		}
	}
	
	public static function searchForLastProject():Void
	{
		var pathToLastProject:String = Browser.getLocalStorage().getItem("pathToLastProject");
		if (pathToLastProject != null)
		{
			openProject(pathToLastProject);
		}
	}
	
}