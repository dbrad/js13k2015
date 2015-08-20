# js13k Competition 2015
This is David Brad's entry for the js13k competition for 2015 (http://http://js13kgames.com/)
<br><br>

#Copyright info for images in "sheet.png"
Most sprites and textures in sheet.png were created by "Lucid Design" (http://luciddesign.tk/) [OGA-BY 3.0]<br>
<b>Link to original work - http://opengameart.org/content/rogue-dungeon</b><br>
Individual sprites and textures extracted to save precious bytes for the competition.
<br>

#Notes about the workflow for this project
All of the code was written in TypeScript, and compiled to Javascript.<br>
I use a gulp workflow to automatically concat to .js files; minify the .html, .css, .js, and .png files; and then finally zip all of the resulting files together.<br>
This workflow works great for keeping a close eye of the size of your final product as you work, making the 13kb package restriction abit easier to manage.

#Notes about the sounds for this project
For the sounds I used http://github.grumdrig.com/jsfxr/ to create minimalistic beeps and boops with minimal samples / size.
