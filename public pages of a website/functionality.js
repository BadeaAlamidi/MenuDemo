// JavaScript source code
'use strict';
// import disableScroll from 'disable-scroll';
// const { on } = require("nodemon");
// var activePod; //this is for tab2 to decide which pod has opened the midmenu so that the pod's text is altered. its value changes/is set by the setPod function
// var currentTab='tab1';
var stack = []; //and array that will store how far into the ui the agent is and what the result of pressing "Escape" will do
function addTostack(object) {
	if (stack.length == 0) return stack.push(object);
	else if (object.eventName !== stack[stack.length - 1].eventName) return stack.push(object);
}
function playSignificance(){

	let audioElement=document.createElement("audio");
	audioElement.setAttribute("autoplay","");
	audioElement.setAttribute("src",'https://vgmdownloads.com/soundtracks/nier-automata-original-soundtrack/ypxppyfh/2-01%20Significance%20-%20Marina%20Kawano%20-%20Emi%20Evans.mp3');
	audioElement.setAttribute("type","audio/mp3");
	document.body.appendChild(audioElement);
}
function getRandomInteger(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
/*how elements are hidden. can hide a specific element or hide elements that 
are currently displayed in the middle of the page(anything with a class of "tabContent")*/
function filter(Class) {

	let x = Class ? document.getElementsByClassName(Class) : document.getElementsByClassName("tabContent");
	let i;
	for (i = 0; i < x.length; ++i) {
		x[i].style.display = "none";
	}

	// document.getElementById(tabId).style.display="block";
}

/* sets one element from hidden to visible as a block unless specified otherwise on the 2nd parameter*/
function display(tabId, Style) {
	Style ? document.getElementById(tabId).style.display = Style : document.getElementById(tabId).style.display = "block";
}

/* this is used for tab two to show the description of the option the is being hovered over*/
function displayDescription(descriptionPath) {
	//let displayWindow=document.getElementById("descriptionContainer");
	//displayWindow.setAttribute("src",descriptionPath);
	document.getElementById("descriptionContainer").src = descriptionPath;
}
/*this is used to set which Pod's program from the 3 is being changed*/
function setPod(podId) {
	var podContainer = document.getElementById("tab2Content");
	if (podId) {
		displayDescription("./descriptions/demo" + document.getElementById(podId).dataset.program.slice(6) + '.html');
		podContainer.style.setProperty("--selectedPod", parseInt(podId.slice(7)));
	}
	// podContainer.style.setProperty("--afterVisibility",podId?"visible":"hidden");
	return podId ? document.getElementById(podId) : undefined;
}
/* this is used to set a pod's set option to whatever the user clicked with their mouse*/
function setPodProgram(programName, activePod) {
	// activePod.innerHTML = `top text<pre style="display:inline">                    </pre> right text<br>${programName}`;
	activePod.querySelector(".programName div").innerText=programName;
	activePod.dataset.program = programName;

}
/*this function triggers when the browser window is resized UPDATE: this is unused*/
function tab2Optimize() {

	if (document.getElementById("descriptionContainer").getBoundingClientRect().width > 340) { }
}
window.addEventListener('keydown', (event) => {
	if (event.key == 'Escape' && stack.length != 0) { stack.pop().back(); }
});

function setButton(element){//function to appened each element with the classname of "button" with child elements that will format the buttons as intended
	var temp=element.textContent; 
	element.innerHTML=""; 
	element.appendChild(document.importNode(document.querySelector('template.buttonSetting').content,true));
	element.querySelector(".text").textContent=temp;
}
function setSideBar(sidebar){
	var sidebarHeight;
	sidebar.querySelector(".grip").style.height = sidebarHeight = sidebar.querySelector(".optionsViewport").getBoundingClientRect().height/sidebar.querySelector(".optionsContainer").getBoundingClientRect().height*100+"%";
}
function setGuideElements(instructionText,documentFragment){//documentFragment would be the document fragment imported from a template element in index.html that would later be appended. this isn't the case yet as there's only one button being used, (Esc)
	guide.querySelector("#guideButtons").innerHTML=""; 
	if(instructionText)guide.querySelector("#instruction").textContent=instructionText;
	if (documentFragment) { guide.querySelector("#guideButtons").appendChild(document.importNode(document.querySelector("template.guideButtonTemplate").content,true));
	animStart(updateGuideButton,289);}
}

function mouseUpFunction(e){/*scrolling=false;*/ document.documentElement.dataset.scrolling = "false"; console.log(element);console.log("mouseup");}
function mouseDownFunction(e){
	if (e.target.className==='grip'){
	let grip = e.currentTarget.querySelector('.grip');
	document.documentElement.dataset.scrolling = "true";
	e.currentTarget.dataset.mouseGripdistance = e.clientY-grip.getBoundingClientRect()["top"];
	}
}

function mouseMoveFunction(e){
	let element = e.currentTarget;
	let grip = element.querySelector('.grip');
	let gutter=element.querySelector('.sideBarGutter');
	const yOffset=gutter.getBoundingClientRect()["top"];
	let arrowButtons=[element.querySelector(".topButton"), element.querySelector(".bottomButton")];
	let mouseGripdistance = parseFloat(e.currentTarget.dataset.mouseGripdistance);
	let content= element.querySelector('.optionsContainer');
	
	if(document.documentElement.dataset.scrolling==='true' && element.dataset.scrollable==="true"){
		// if(grip.getBoundingClientRect()["top"]>=yOffset && grip.getBoundingClientRect()["bottom"]<=gutter.getBoundingClientRect()["bottom"])
		if (e.clientY-yOffset-mouseGripdistance>=0 && e.clientY-yOffset-mouseGripdistance+grip.getBoundingClientRect()["height"]<=gutter.getBoundingClientRect()["height"])
		{grip.style.top=(e.clientY-yOffset-mouseGripdistance)+'px'; 
		// content.style.top=(grip.getBoundingClientRect()["bottom"]-grip.getBoundingClientRect()["height"]-yOffset)/(gutter.getBoundingClientRect()["height"]-grip.getBoundingClientRect()["height"])*-100+'%';
		// content.style.top=-(grip.getBoundingClientRect()["bottom"]-grip.getBoundingClientRect()["height"]-yOffset)/(gutter.getBoundingClientRect()["height"]-grip.getBoundingClientRect()["height"])*(content.getBoundingClientRect()["bottom"]-gutter.getBoundingClientRect()["y"])+"px";
		content.style.top=-(grip.getBoundingClientRect()["bottom"]-grip.getBoundingClientRect()["height"]-yOffset)/(gutter.getBoundingClientRect()["height"]-grip.getBoundingClientRect()["height"])*(content.getBoundingClientRect()["height"]-gutter.getBoundingClientRect()["height"])+"px";
		
		arrowButtons[0].style=null;
		arrowButtons[1].style=null;
	}
	else{
		// element.querySelector(`${grip.getBoundingClientRect()["bottom"]-grip.getBoundingClientRect()["height"]-yOffset==0?"topButton":"bottomButton"}`).style.opacity=0.7;
		if (grip.getBoundingClientRect()["top"]==gutter.getBoundingClientRect()["top"])arrowButtons[0].style.opacity=0.7;
		if (grip.getBoundingClientRect()["bottom"]==gutter.getBoundingClientRect()["bottom"])arrowButtons[1].style.opacity=0.7;
		}
	}
}

function setScrolling (element){	
	var result=[];
	element.removeEventListener("mousedown", mouseDownFunction);
	element.ownerDocument.removeEventListener('mouseup', mouseUpFunction);
	element.removeEventListener('mousemove', mouseMoveFunction);

	element.addEventListener('mousedown',mouseDownFunction);
	element.ownerDocument.addEventListener('mouseup',mouseUpFunction);
	element.addEventListener('mousemove',mouseMoveFunction);

return result;	
}
//SCRAPPED. WILL NOT WORK. all calls will be commented out
function resetScrolling(sidebar,eventCollection){//reset the position of the grip and content and removes the event listeners that were set by setScrolling function.  @0 mousedown event function@1 mouseup event function @2 mousemove event function
 sidebar.querySelector('.grip').style=null;
 sdiebar.querySelector('.optionsContainer').style=null;
 sdiebar.removeEventListener("mousedown",eventCollection[0]);//if all mouseup events were removed, scrolling will not stop for any sidebar! --- each function has a specific version of "scrolling" in setScrolling function
 sdiebar.ownerDocument.removeEventListener("moouseup",eventCollection[1]);
 sdiebar.removeEventListener("mousemove",eventCollection[2]);
}
function setBanners(){
	let topBannerSVG=document.getElementById("topBanner").querySelector(".patternContainer");
	let bottomBannerSVG=document.getElementById("bottomBanner").querySelector(".patternContainer");
	let svgWidth=window.innerWidth*0.9-(window.innerWidth*0.9%55)+10;
	
	topBannerSVG.style.width=svgWidth + 'px';
	topBannerSVG.style.right=(window.innerWidth-svgWidth)/window.innerWidth*50 + '%';

	bottomBannerSVG.style.width=svgWidth + 'px';
	bottomBannerSVG.style.left=(window.innerWidth-svgWidth)/window.innerWidth*50 + '%';

}
function setBackgroundShapes(radius){
	const circumference=2*Math.PI*radius;
	const quadrant=Math.PI*0.5*radius;
	const circles=Array.from(document.getElementsByClassName("bgCircle"));
	circles.forEach((circle,index)=>{circle.style.strokeDasharray=`${circumference-quadrant} ${quadrant*1.1}`; //multiplied by one point one to ensure that shifted circles are fully invisible in the begininng
	circle.style.strokeDashoffset=index>1?quadrant:3*quadrant;
	// console.log(quadrant , circumference, radius)
});
}
// 
// ANIMATIONS:
// 
// 
var headerChildren;
var header;
var guide;
var content1Wrapper;
var tab1Options;
document.addEventListener('DOMContentLoaded',  ()=>  {
	document.getElementById("tab1Document").contentWindow.addEventListener('keydown', (event) => {if (event.key == 'Escape' && stack.length != 0) { stack.pop().back(); }});
	// var bgChildren=Array.from(document.getElementById("backgroundSVG").children);
	var activePod;
	var currentTab = 'tab1';
	// var scrollbarCollection=[];
	Array.from(document.getElementsByClassName("button")).forEach(setButton);// this line was for dynamically appending SVG's to buttonss
	Array.from(document.querySelectorAll(".bottomButton,.topButton")).forEach(element=>element.appendChild(document.importNode(document.querySelector('template.svgCircle').content,true)));//append circle template
	Array.from(document.getElementsByClassName("grip")).forEach(gripElement=>{gripElement.appendChild(document.importNode(document.querySelector('template.gripTemplate').content,true))});
	/*background animation:*/setBanners();
	animStart(updateBanner,300,[document.getElementById("topBanner"),document.getElementById("bottomBanner")]);
	setBackgroundShapes(document.getElementById("topLeftSmallCircle").getBoundingClientRect()["width"]/2);//set the circles and lines with the right dimensions prior to starting the naimation
	window.addEventListener('load',()=>{
		animStart(updateBgShapes,666,
			[document.getElementById("topLeftBigCircle"),document.getElementById("botRightBigCircle"),document.getElementById("botRightBigCircle").r.baseVal.value*Math.PI*0.5,document.getElementById("topFirstLine"),document.getElementById("bottomFirstLine"),43,86,5]);
	  });	
	document.getElementById("backgroundSVG").addEventListener("animateSmallCircles",()=>{animStart(updateBgShapes,666,
		[document.getElementById("topLeftSmallCircle"),document.getElementById("botRightSmallCircle"),document.getElementById("botRightBigCircle").r.baseVal.value*Math.PI*0.5,document.getElementById("topSecondLine"),document.getElementById("bottomSecondLine"),51,102,0]); },{once:true});
	document.getElementById("backgroundSVG").addEventListener("animateThirdLines",()=>{ animStart((playback, args)=>{//@0 top line @1 bottom line @2 x magnitude @3 y magnitude
		args[0].setAttributeNS(null,'x2',`${Math.pow(playback,0.5)*args[2]}%`);
		args[0].setAttributeNS(null,'y2',`${Math.pow(playback,0.5)*args[3]+6}%`);
		args[1].setAttributeNS(null,'x2',`${100-Math.pow(playback,0.5)*args[2]}%`);
		args[1].setAttributeNS(null,'y2',`${100-Math.pow(playback,0.5)*args[3]-6}%`);
		//the +-6 is done since the top and bottom lines respectively begin with 0%+6% and 100%-6% on y axis
	},666, [document.getElementById("topThirdLine"),document.getElementById("bottomThirdLine"),43,86])},{once:true});
	/*header animation:*/header = document.getElementById("header"); headerChildren = Array.from(header.children); console.log(header); 
	content1Wrapper = document.getElementById("tab1ContentWrapper"); /*content1WrapperPanel=window.getComputedStyle(document.querySelector('#tab1ContentWrapper'),'::before')*/;
	tab1Options = Array.from(document.getElementsByClassName('tab1'));
	guide = document.getElementById("guide");
	document.getElementById("header").addEventListener('playHeaderAnim',()=>{animStart(updateHeader, 304);},{once:true});
	content1Wrapper.addEventListener('wrapper1Anim', () => { animStart(updateWrapper1, 192); }, { once: true });
	guide.addEventListener("guideAnim", () => { animStart(updateGuide, 289); }, { once: true });
	document.getElementById("backgroundSVG").addEventListener("animateBg",function () {setInterval(()=>{
		var bgShapesDirection;//originally intended to undo the translation but was repurposed for a smaller shift magnitued when false
		Array.from(this.children).forEach((shape)=>{
			switch(shape.className.baseVal){

				case "bgLine":shape.style.transform=bgShapesDirection?`translate(${Math.random()*2}%,${Math.random()*2}%)`:`translate(${Math.random()*1}%,${Math.random()*1}%)`; break;
				case "bgCircle":shape.style.transform=bgShapesDirection?`translate(${Math.random()*1}%,${Math.random()*2}%)`:`translate(${Math.random()*1}%,${Math.random()*2}%)`; break;
			}
			// console.log(`translate(${Math.random()*2}%,${Math.random()*2})`);
		});
		bgShapesDirection=!bgShapesDirection;
	},2500);},{once:true})
	animateText(document.getElementById("title"));
	document.getElementById("tab2Midmenu").addEventListener('click', (event) => {
		if (event.target.className === "tab2Option button") { setPodProgram(event.target.id, activePod); }
	});
	document.getElementById("tab2Midmenu").addEventListener('mouseover', (event) => {
		if (event.target.className === "tab2Option button") {
			displayDescription('./descriptions/demo' + event.target.id.slice(6) + '.html');
			document.getElementById("descriptionContainer").contentWindow.addEventListener("keydown",(event)=>{
				if (event.key == 'Escape' && stack.length != 0) { stack.pop().back(); }
				});
		}
	});
	document.getElementById("tab2Content").addEventListener('click', function (event) {
		if (event.target.nodeName == "SPAN") {
			if (document.getElementById("tab2MidmenuWrapper").style.display == "none"){ 
				setGuideElements("Select Pod program to equip.",1);
				document.getElementById("subTitle").textContent+=': ';
				animateText(document.getElementById("subTitle"),0,event.target.id,true);
				animStart(fadeIn, 208, [document.getElementById("tab2MidmenuWrapper"), 'inline-flex']);//display('tab2MidmenuWrapper','inline-flex');
				setSideBar(document.getElementById('midMenuSidebar'));
				/* scrollbarCollection[scrollbarCollection.length]= */setScrolling(document.getElementById('midMenuSidebar'));
			}
			Array.from(document.getElementsByClassName("tab2")).forEach((pod)=>{pod.dataset.pressed='false';}) //not a clever fix
			event.target.dataset.pressed = 'true';
			activePod = setPod(event.target.id);
			animStart(updateProperty, 208, ['--afterVisibility', this]);
			addTostack({ eventName: 'disableTab2Menu', back: function () { /*resetScrolling(document.getElementById('midMenuSidebar'),scrollbarCollection.pop());*/ animStart(fadeOut, 208, [[document.getElementById("tab2MidmenuWrapper")], 0, 'backTotab2Content',true]);} });
			document.addEventListener('backTotab2Content', () => { animStart(updateProperty, 208, ['--afterVisibility', this, true]); activePod=setPod(); event.target.dataset.pressed='false';setGuideElements("Select Pod.");
			document.getElementById("subTitle").textContent="-Pod Programs";
			}, { once: true });
		}
	});
	document.getElementById("tab2Content").addEventListener('mouseover', (event) => {
		if (event.target.nodeName == "SPAN" && document.getElementById("tab2MidmenuWrapper").style.display == "none") {
			displayDescription('./descriptions/demo' + event.target.dataset.program.slice(6) + '.html');
			if (document.getElementById("descriptionContainer").style.display == 'none')
				animStart(fadeIn, 167, [document.getElementById("descriptionContainer"), "block"]);
            event.target.dataset.pressed = 'true';
        }
	});
    document.getElementById("tab2Content").addEventListener('mouseout', (event) => {
        if (event.target.nodeName == 'SPAN' && activePod == undefined) { event.target.dataset.pressed = 'false'; }
	});
	// document.getElementById('tab1nestedContent')
	document.getElementById('tab1nestedContent').addEventListener('mouseover', function (event) {
		if (event.target.className == 'nested button' && document.getElementById("tab1DocumentHeader").dataset.pressed == 'false' ) {  
			document.getElementById('tab1Document').setAttribute("src","./dummy.html");//change which document displays here
			display("tab1DocumentHeader",'flex'); display("tab1Document");
			document.getElementById("tab1Document").contentWindow.addEventListener("keydown",(event)=>{
			if (event.key == 'Escape' && stack.length != 0) { stack.pop().back(); }
			});
			// setSideBar(document.getElementById("tab1Document").contentWindow.document.getElementById("contentSidebar"));
			// scrollbarCollection[scrollbarCollection.length]=setScrolling(document.getElementById("tab1Document").contentWindow.document.getElementById("contentSidebar"));
		}
	});
	document.getElementById("tab1nestedContent").addEventListener('click', function (event) {
		if (event.target.className == "nested button") {
			event.target.dataset.pressed="true";
			this.style.pointerEvents="none";
			// console.log(scrollbarCollection);
			document.getElementById('nestedContentSidebar').dataset.scrollable="false";
			document.getElementById('tab1Document').contentWindow.document.getElementById("contentSidebar").dataset.scrollable="true";//#contentSidebar is the id of an element in an iframe from tab1
			document.getElementById("tab1DocumentHeader").dataset.pressed = 'true';
			document.getElementById("subTitle").textContent+=': ';
			animateText(document.getElementById("subTitle"),0,event.target.querySelector('.text').textContent,true);
			addTostack({ eventName: 'backtoNestedContent', back:  ()=>{ document.getElementById("tab1DocumentHeader").dataset.pressed = 'false'; event.target.dataset.pressed="false"; 
				document.getElementById("tab1Document").contentWindow.document.getElementById("contentSidebar").dataset.scrollable="false"; 
				document.getElementById("nestedContentSidebar").dataset.scrollable="true"; this.style.pointerEvents=null; 
				document.getElementById("subTitle").textContent="-Archives";
				/*resetScrolling(document.getElementById('tab1Document').contentWindow.document.getElementById("contentSidebar"),scrollbarCollection.pop());*/} 
			});
		}
	});
	document.getElementById("tab1Content").addEventListener('click', (event) => { 
		if (event.target.className == "tab1 button") {
			let pushedButton = event.target;
			animStart(fadeOut, 128, [[content1Wrapper], 0.7, pushedButton.className]);//filter('tabContent');
			/*display('tab1nestedContentWrapper','grid');*/
			document.addEventListener(pushedButton.className, () => {
				filter('tabContent');
				tab1Options.forEach((option) => { option.style = null;  });
				content1Wrapper.style.setProperty('--beforeHeight', null);
				setGuideElements("View the information archives.",1);
				animateText(document.getElementById("subTitle"),0,"-Archives");
				addTostack({
					eventName: "backTotab1Content", back: function () {
						animStart(fadeOut, 128, [[document.getElementById("tab1nestedContentWrapper")], 0.7, "backTotab1Content", true]);
						//resetScrolling(document.getElementById("nestedContentSidebar"),scrollbarCollection.pop());
						document.addEventListener('backTotab1Content', () => { content1Wrapper.style.display = 'flex'; animStart(updateWrapper1, 192);setGuideElements("View various types of acquired data.");
						 document.getElementById("subTitle").textContent="";}, { once: true });
					}
				});
				animStart(fadeIn, 128, [document.getElementById('tab1nestedContentWrapper'), 'grid']);
				setSideBar(document.getElementById("nestedContentSidebar"));
				/*  scrollbarCollection[scrollbarCollection.length]=*/setScrolling(document.getElementById("nestedContentSidebar"));
			}, { once: true });
		}
	});
	document.getElementById("header").addEventListener('click', (event) => {
		if (event.target.className === 'tab button' && event.target.id !== currentTab) {
			let pushedButton = event.target;
			let transitionObject = {};//contains the element that will be displayed, the kind of the display, and the name of the event that will trigger the fadeIn
			//check for when switching from tab2 to another tab:
			// if (currentTab=='tab2' && pushedButton.id!="tab2"){setPod();}
			document.getElementById(currentTab).dataset.pressed='false';
			currentTab = pushedButton.id;
			pushedButton.dataset.pressed="true";
			switch (pushedButton.id) {//tab specific operations and transitions
				case 'tab1': transitionObject["id"] = "tab1ContentWrapper";//event.target.addEventListener("transTotab1",()=>{filter('tabContent');animStart(fadeIn,1000,[document.getElementById("tab1ContentWrapper"),"flex",1,event.target,'initiateTab1'])},{once:true});
					transitionObject["displayType"] = "flex";
					// document.addEventListener(pushedButton.id,()=>{console.log("running event"+pushedButton.id);animStart(updateWrapper1,133)},{once:true});/*display('tab1ContentWrapper','flex');*/
					document.addEventListener(`transTo${pushedButton.id}`, () => { filter('tabContent'); content1Wrapper.style.display = "flex"; animStart(updateWrapper1, 192); 
					setGuideElements("View various types of acquired data."); animStart(updateGuide,192);}, { once: true });
					break;
				case 'tab2': transitionObject["id"] = "tab2Wrapper";
					transitionObject["displayType"] = "flex";
					document.addEventListener(pushedButton.id, () => { console.log("running event" + pushedButton.id); }, { once: true });
					document.addEventListener(`transTo${pushedButton.id}`, () => { filter('tabContent'); 
					animStart(fadeIn, 192, [document.getElementById(transitionObject["id"]), transitionObject["displayType"], 1, pushedButton.id]);
					animateText(document.getElementById("subTitle"),0,"-Pod Programs"); 
					setGuideElements("Select Pod.");animStart(updateGuide,192);}, { once: true });
					
					break;
				//display('tab2Wrapper','grid'); break;                            
			}
			stack=[];
			activePod=setPod();//this is done outside the reset function since active Pod variable is no longer active
			reset();
			animateText(document.getElementById("title"),0,event.target.querySelector(".text").textContent);
			animStart(updateProperty,192,['--guideOpacity',document.getElementById("guide"),true]);
			// scrollbarCollection.forEach((element)=>{resetScrolling(element);});
			// scrollbarCollection=[];
			animStart(fadeOut, 192, [Array.from(document.getElementsByClassName("tabContent")), 1, `transTo${pushedButton.id}`]);

 
		}
	});

}
);

function animStart(callback, duration, args) {
	// var elemen= document.getElementById("header").children;
	var timeStarted = Date.now();
	// var duration=1000;
	// console.log("animation function was called");
	callback(0, args);
	requestAnimationFrame(function update() {
		// console.log("update was called");
		var playback = Math.min((Date.now() - timeStarted) / duration, 1);//sometimes playback evaluates to equal more than one even thought its restricted by playback<=1
		callback(playback, args);
		if (playback < 1)
			requestAnimationFrame(update);

	}
	);
}
function updateHeader(playback) {
	header.style.opacity = playback;
	if (playback >= 1) animStart(updateHeaderTabs, 319)
}
function updateHeaderTabs(playback) {
	// console.log("header animation was called");
	// console.log(header);
	if (playback > .7) { content1Wrapper.dispatchEvent(new Event('wrapper1Anim')); guide.dispatchEvent(new Event('guideAnim')); document.getElementById("backgroundSVG").dispatchEvent(new Event("animateBg")); }
	headerChildren.forEach((button, index) => {
		if (index == headerChildren.length - 1) { button.style.opacity = playback; }
		else if (index == 0) { button.style.opacity = playback + (playback / .9) }//else if (button===headerChildren[0])
		else button.style.opacity = playback + (playback / index); //+(playback/headerChildren.indexOf(button))
	}
	);
	// header[header.length-1].style.opacity=playback;
	// console.log(header[header.length-1].style.opacity);
}
function updateWrapper1(playback) {
	if (playback == 1) {

		tab1Options.forEach((option, index) => {
			// timeout=index*640;
			setTimeout(animStart, 64 * index, updateTab1Options, 200, [option, index]);
			animateText(option, index * 64);
		});
	}
	content1Wrapper.style.setProperty('--beforeHeight', (Math.pow(playback, 0.1)) * 100 + '%');
	content1Wrapper.style.opacity = playback;

}
function updateTab1Options(playback, optionIndex) {//option index is an array that contains both the element @ [0] and its index @[1]
	optionIndex[0].style.opacity = Math.pow(playback, 0.5);
	// console.log("attempting to change position of element " + option + " which is located at index: " + tab1Options.indexOf(option));
	// option.style.right=(parseFloat(getComputedStyle(option).right)-(playback*Math.pow(parseFloat(getComputedStyle(option).right),1/2))) + 'px';
	optionIndex[0].style.right = (14) * (1 - Math.pow(playback, 0.1)) + '%';
	optionIndex[0].setAttribute("option", `${playback}`);//this was for debugging
}
function updateGuide(playback) {
	guide.style.setProperty('--guideOpacity',playback) ;
	guide.style.bottom = 4.3 + (4 * Math.pow(playback, 0.5)) + 'vh';
}
function updateGuideButton(playback){
	guide.querySelector("#guideButtons").style.top=100-(Math.pow(playback,0.5)*100)+'%';
	guide.querySelector("#guideButtons").style.opacity=playback;
}
function animateText(element, delay, string,keepText) {
	let index = 0;
	let print = false;
	let textContainer= element.querySelector(".text")||element;
	let currentText =keepText? textContainer.textContent:"";
	let input = string ? string : textContainer.textContent;
	// string?input=string:input=element.innerHTML;
	if (!keepText)textContainer.textContent = "";
	setTimeout(() => {
		let intervalId = setInterval(() => {
			// console.log(print);
			if (index != input.length - 1) {
				currentText += print ? input[index] : '';
				textContainer.textContent = currentText + (index + 1 < input.length - 1 ? input[getRandomInteger(0, input.length - 1)] : '');
				// console.log(inervalId);
				if (print)++index;
				print = !print;
			}
			else { textContainer.innerHTML += input[input.length - 1]; clearInterval(intervalId); }//console.log("last letter of the string is "+ string[string.length-1]);}
			// console.log(input[getRandomInteger(0,input.length)] + "is a random letter for the string: " + input);
		}, 50);
	}, delay);
}
function fadeOut(playback, args) {//array contents: element@[0] eventFlag@[1] eventName@[2] flag to make style.display none when playback =0
	args[0].forEach((element) => { element.style.opacity = 1 - Math.pow(playback, 0.5); })

	if (playback >= args[1]) { document.dispatchEvent(new Event(`${args[2]}`)); }//this is typically true when the element that is being faded out is positioned absolutely
	if (playback == 1 && args[3]) args[0][0].style.display = 'none';
}
function fadeIn(playback, args) {//array contents: element@[0] type of display(string)@[1] eventFlag@[2] eventName@[3]
	args[0].style.opacity = Math.pow(playback, 0.5);
	if (playback == 0) args[0].style.display = args[1];
	if (playback >= args[2]) document.dispatchEvent(new Event(`${args[3]}`));
}
//This function is scrapped. its logic is not correct
function updateColorValue(playback, args) {//@0 args is which element to darken/lighten @1 is initial color (hex)@2 is the difference from the initial color (hex)@3 determines whether the element will get lighter or darker(true for darken)
	var result;
	args[3] ? result = parseInt(args[1], 16) - Math.floor(playback * parseInt(args[2], 16)).toString(16) : result = parseInt(args[1], 16) + playback * parseInt(args[2], 16).toString(16);
	args[0].style.backgroundColor = '#' + result;
	console.log(result);
}
function updateProperty(playback, args) {//@0 property, @1 element, @2 negative boolean   general purpose function for increasing/decreasing css variables
	args[2] ? args[1].style.setProperty(args[0], 1 - (Math.pow(playback, 0.5))) : args[1].style.setProperty(args[0], (Math.pow(playback, 0.5)));
}
function updateBanner(playback, elements){//@0 is topBanner @1 is bottomBanner
 if(playback>0.38)document.getElementById("header").dispatchEvent(new Event("playHeaderAnim"));
 elements[0].style.width=Math.pow(playback,0.5)*100+'%';
 elements[1].style.width=Math.pow(playback,0.5)*100+'%';

}
function updateBgShapes(playback, args){//@0 top left circle @1 bottom right circle @2 style.dashOffset @3top line @4bottom line @5 x magnitude @6 y magnitude @7 offset
	let rootedPlayback=Math.pow(playback,0.5);
	if (playback>=0.5) document.getElementById("backgroundSVG").dispatchEvent(new Event("animateSmallCircles"));
	if (playback == 1) document.getElementById("backgroundSVG").dispatchEvent(new Event("animateThirdLines"));
	args[0].style.strokeDashoffset=args[2]*3 - 2*args[2]*rootedPlayback;
	args[1].style.strokeDashoffset=args[2] - 2*args[2]*rootedPlayback
	args[3].setAttributeNS(null,'x2',`${rootedPlayback*args[5]+args[7]}%`);
	args[3].setAttributeNS(null,'y2',`${rootedPlayback*args[6]}%`);
	args[4].setAttributeNS(null,'x2',`${100-rootedPlayback*args[5]-args[7]}%`);
	args[4].setAttributeNS(null,'y2',`${100-rootedPlayback*args[6]}%`); 
}
//
//function for resetting the tab information when switching
//
function reset() {
	tab1Options.forEach((option) => { option.style = null;  });
	content1Wrapper.style.setProperty('--beforeHeight', null);
	document.getElementById("tab2Content").style.setProperty('--afterVisibility',null);
	guide.querySelector("#guideButtons").innerHTML="";
	document.getElementById('tab1DocumentHeader').dataset.pressed=false;
	Array.from(document.getElementsByClassName("tab2")).forEach((pod)=>{pod.dataset.pressed='false'});
	Array.from(document.getElementsByClassName("nested")).forEach((archiveButton)=>{archiveButton.dataset.pressed='false';});
	document.getElementById("nestedContentSidebar").dataset.scrollable="true";
	document.getElementById("tab1nestedContent").style.pointerEvents=null;
	document.getElementById("subTitle").textContent="";
	// Array.from(document.getElementsByClassName("sidebar")).forEach((sidebar)=>{resetScrolling(sidebar)})
}
// i will repurpose the function of the reset function instead of popping each element in the stack and/or checking whether elements are being popped from 'escape' or from changing tabs
// it will change datasets that cause css animations to trigger. while this DOES happen simply by popping and applying each element in the stack variable, it will trigger the same animation twice