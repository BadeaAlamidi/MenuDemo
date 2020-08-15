//following two functions are copy-paste from functionlity.js
//they execute as soon as the page loads
function setSideBar(sidebar){
	var sidebarHeight;
	var viewPortComputedStyle=window.getComputedStyle(sidebar.querySelector(".sideBarGutter"))["height"];
	var optionsComputedStyle=sidebar.querySelector(".optionsContainer").getBoundingClientRect()["height"]
	sidebar.querySelector(".grip").style.height = Math.min(  parseInt(viewPortComputedStyle,10)/optionsComputedStyle*100,100)+'%';
	// console.log(parseInt(viewPortComputedStyle,10));
	// console.log("height of image is "+document.getElementById("descriptionImage").getBoundingClientRect()["height"]);
}
function setScrolling(element){//enable the grip (and content, through the grip) to respond to mouse input
	var scrolling=false;
	var grip=element.querySelector(".grip");
	var gutter=element.querySelector('.sideBarGutter');
    var content= element.querySelector('.optionsContainer');
    var arrowButtons=[element.querySelector(".topButton"),element.querySelector(".bottomButton")];
	var mouseGripdistance;
    const yOffset=gutter.getBoundingClientRect()["top"];
    arrowButtons[0].style.opacity=0.9;
	element.addEventListener('mousedown',(e)=>{if(e.target.className=="grip"){scrolling=true;mouseGripdistance=e.clientY-grip.getBoundingClientRect()["top"];} });
	document.addEventListener('mouseup',()=>{scrolling=false; });
	element.addEventListener('mousemove',(e)=>{if(scrolling && element.dataset.scrollable=="true"){
		if (e.clientY-yOffset-mouseGripdistance>=0 && e.clientY-yOffset-mouseGripdistance+grip.getBoundingClientRect()["height"]<=gutter.getBoundingClientRect()["height"])
		{grip.style.top=(e.clientY-yOffset-mouseGripdistance)+'px'; 
		content.style.top=-(grip.getBoundingClientRect()["bottom"]-grip.getBoundingClientRect()["height"]-yOffset)/(gutter.getBoundingClientRect()["height"]-grip.getBoundingClientRect()["height"])*(content.getBoundingClientRect()["height"]-gutter.getBoundingClientRect()["height"])+"px";

		arrowButtons[0].style=null;
		arrowButtons[1].style=null;
        }
        if (grip.getBoundingClientRect()["top"]==gutter.getBoundingClientRect()["top"])arrowButtons[0].style.opacity=0.7;
		if (grip.getBoundingClientRect()["bottom"]==gutter.getBoundingClientRect()["bottom"])arrowButtons[1].style.opacity=0.7;
		// console.log("test");

	} });	
}
addEventListener("load",()=>{
	document.getElementsByClassName("topButton")[0].appendChild(document.importNode(document.querySelector('template.svgCircle').content,true));
	document.getElementsByClassName("bottomButton")[0].appendChild(document.importNode(document.querySelector('template.svgCircle').content,true));
	document.getElementsByClassName("grip")[0].appendChild(document.importNode(document.querySelector('template.gripTemplate').content,true));
	setSideBar(document.getElementById("contentSidebar"));
	setScrolling(document.getElementById("contentSidebar"));
	// console.log(document);
});