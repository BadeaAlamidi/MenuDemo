// TO DO: 
//-RECREATE ARCHIVE DISPLAY IN TAB1 SO THAT NO IFRAMES ARE USED
//-RECREATE THE THIRD DEMO 1,2,3,ETC..  PANEL SO THAT NO IFRAMES ARE USED
//-FIX THE ANIMATE TEXT FUNCTION SO THAT NO WEIRD BEHAVIOR HAPPENS WHEN A TEXT IS CHANGED
//-     WHILE IT IS STILL ANIMATING FROM A PREVIOUS ACTION
//-THE HEADER DOES NOT CHANGE CORRECTLY IDENTIFY THE CHOSEN POD IF THE USER SWITCHES TO
//-ANOTHER POD WHILE ANOTHER ONE IS ALREADY SELECTED
'use strict';
// an object type that will be added to the stack array declared globally.
// layers are used as a way describing how nested the user is into the UI, and they are 
// specified as a way to tell the program what should be removed from the interface if the
// user presses the Esc button
// 
// EventName: used as an identifier to avoid adding the same object into the stack array
// Back: function that specifies which animations should play 
interface layer{
    eventName : string;
    back : ()=>void;
};
type DOMMouseEvent = MouseEvent & {readonly target: HTMLElement, readonly currentTarget: HTMLElement};
// this array is pushed back to when a layer is inserted. the order of the elements
// matters as they represent the order of nesting the user is currently on
let stack : Array<layer> = [];

// appends to the stack array the passed object. 
// ensures no duplicates are added to the stack by checking the layer's EventName with the last entry
function addToStack(object: layer): void{
    if (object.eventName !== stack[stack.length - 1].eventName)
        stack.push(object);
}

// function that plays Significance soundtrack from the game
function playSignificance(): void{
    let audioElement : HTMLElement = document.createElement("audio");
    audioElement.setAttribute("autoplay","");
    audioElement.setAttribute("src","https://vgmdownloads.com/soundtracks/nier-automata-original-soundtrack/ypxppyfh/2-01%20Significance%20-%20Marina%20Kawano%20-%20Emi%20Evans.mp3");
    audioElement.setAttribute("type","audio/mp3");
    document.body.appendChild(audioElement);
}

// function that returns a random number within the specified range between min and max
function getRandomInteger(min : number, max : number): number{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// how elements are hidden. can hide a specific element or hide elements that
// are currently displayed in the middle of the page (anytihng with a class of "tabContent")
function filter(htmlClass = "tabContent") : void{
    let elements = document.getElementsByClassName(htmlClass) as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < elements.length; ++i )
    {
        elements[i].style.display = "none";
    }   
}

// function that sets one element from hidden to visible as a block unless specified 
// otherwise on the 2nd parameter
function display (tabId: string, dispStyle: string = "block"): void{
 //check if element exists before changing its display CSS property
    let target :HTMLElement | null= document.getElementById(tabId);
    target && (target.style.display = dispStyle);
}

// this function is used for tab2 on the interface to show the 
// descriptions of the option that is being hovered over. Hopefully this will be made 
// obsolete or at least changed once frames are no longer used to show descriptions
// of pod programs
function displayDescription(descriptionPath: string): void{
    const descriptionContainer: HTMLIFrameElement = document.getElementById("descriptionContainer") as HTMLIFrameElement;
    descriptionContainer && (descriptionContainer.src = descriptionPath);
}

// function for setting one of the three pods' program to be subject to having its 
// program changed. this works in tandem with setPodProgram()
//
// if podId not provided in a call to this function, the pod target is reset to undefined
function setPod(podId?: string):HTMLElement | null{
    const podContainer: HTMLElement | null = document.getElementById("tab2Content");
    if (podId){
        displayDescription("./description/demo" + document.getElementById(podId)!.dataset.program!.slice(6) + '.html');
        podContainer?.style.setProperty("--selectedPod",podId.slice(7));
        
        //assert that getElementById will always return something
        return document.getElementById(podId)!;
    } else return null;
}

// used to set the active pod (denoted by the activePod variable) program to
// what the user clicks on the tab2Midmenu
function setPodProgram(programName: string, activePod: HTMLElement | null) : void{
    let activePodText: HTMLElement = activePod?.querySelector(".programName div") as HTMLElement ;
    activePodText.innerText = programName;
}

// function to appened each element with the classname of "button" and appends 
// a template in index.html into a button element 
function setButton(element: Element): void{
    let temp: string | null = element.textContent;
    if (temp){
        //adds the template to the button div
        element.appendChild(document.importNode(
            document.querySelector('template.buttonSetting')!,true
        ));
        //moves the text content of the previous to the newly fashioned button element
        let buttonText : HTMLElement | null= element.querySelector(".text");
        (buttonText) && (buttonText.textContent = temp);
    }
}

// sets the height of a sidebar element (sidebar element)
function setSideBar(sidebar : HTMLElement | null) : void {
    if (sidebar){
        let viewportHeight = sidebar.querySelector(".optionsViewport")?.getBoundingClientRect().height;
        let containerHeight = sidebar.querySelector(".optionsViewport")?.getBoundingClientRect().height;
        let sidebarGrip:HTMLElement | null = sidebar.querySelector(".grip");
        if (viewportHeight && containerHeight){
            let sidebarHeight: Number = viewportHeight / containerHeight;
            (sidebarGrip) && (sidebarGrip.style.height = sidebarHeight.toString() ); 
        }
    } else console.log("sidebar parameter is null");
}

// function that sets the guide bar message on the bottom of the screen, and it can 
// change the buttons that can be pressed to interact with the 
// UI on the far right of the bar.
//
// instructionText: changes the guide bar message
// documentFragment: points to a template element in the HTML that describes the buttons
//                   that can be currently used in the UI
// Note: currently, only Esc is used 

function setGuideElements(instructionText?: string, documentFragment?: HTMLTemplateElement ): void{
    // guide  is  checked  to exist before this function is called, warranting the '!'
    // on the following two lines. 
    //the query selector methods assume that this script is designed Exclusively for 
    // index.html
    let guideButtons: HTMLElement = guide!.querySelector('#guideButtons')!;
    guideButtons.innerHTML = "";
    if (instructionText) guide!.querySelector('#instruction')!.textContent = instructionText;   
    
    //the following defaults to the Esc button template in index.html. once new ones are created, 
    if (documentFragment){
        //I HAVE TO GET RID OF THIS. STOP PASSING 'true' TO THIS FUNCTION'S 2ND PARAMETER
        // if (documentFragment === true as unknown)
            // documentFragment = document.querySelector("template.guideButtonTemplate") as HTMLTemplateElement;
        guideButtons.appendChild(document.importNode(documentFragment.content, true));
        animStart(updateGuideButton,289);
    }
}

// the following two functions are used as parameter for addEventListener
function mouseUp():void{
    document.documentElement.dataset.scrolling = "false";
}

function mouseDown(e:DOMMouseEvent ):void{
    // e.target is sure to be an html element as the even is on an element in the DOM
    let target : HTMLElement = e.target;
    let currentTarget : HTMLElement = e.currentTarget;
    if (target.className === "grip"){
        let grip : HTMLElement = currentTarget.querySelector(".grip") as HTMLElement;
        document.documentElement.dataset.scrolling = "true";
        currentTarget.dataset.mouseGripdistance = (e.clientY - grip.getBoundingClientRect()["top"]).toString();
    }
    
}

// an event listener parameter that is triggered when the mouse moves after dragging a scrolling
// grip.
function mouseMove(e:DOMMouseEvent):void{
    let element = e.target;
    let grip = element.querySelector('.grip') as HTMLElement;
    let gutter = element.querySelector('.sideBarGutter') as HTMLElement;
    const yOffset = gutter!.getBoundingClientRect()["top"];
    // unnecessary destructuring
    const [upArrow, downArrow] : [HTMLElement, HTMLElement] = [element.querySelector(".topButton") as HTMLElement, element.querySelector(".bottomButton") as HTMLElement]
    let mouseGripdistance = parseFloat(e.currentTarget.dataset.mouseGripdistance!);
    let content = element.querySelector('.optionsContainer') as HTMLElement;

    let dragPoint = e.clientY - yOffset - mouseGripdistance;
    if (document.documentElement.dataset.scrolling === 'true' && element.dataset.scrollable === 'true'){
        if (dragPoint >=0 && 
            dragPoint + grip.getBoundingClientRect()["height"] <= gutter.getBoundingClientRect()["height"] ){
                grip.style.top = (e.clientY - yOffset - mouseGripdistance) + 'px';
                //I wish i remember what i was thinking
                content.style.top=-(grip.getBoundingClientRect()["bottom"]-grip.getBoundingClientRect()["height"]-yOffset)
                / (gutter.getBoundingClientRect()["height"]-grip.getBoundingClientRect()["height"])
                *(content.getBoundingClientRect()["height"]-gutter.getBoundingClientRect()["height"])
                +"px";

                upArrow.style.opacity = "";
                downArrow.style.opacity = "";
            } else {
                if (grip.getBoundingClientRect()["top"]==gutter.getBoundingClientRect()["top"])
                    upArrow.style.opacity="0.7";
                if (grip.getBoundingClientRect()["bottom"]==gutter.getBoundingClientRect()["bottom"])
                    downArrow.style.opacity="0.7";        
            }
    }
}

//very disappointing casts that defeat the purpose of typescript
function setScrolling(element : HTMLElement | null) : void{
    element?.removeEventListener("mousedown",mouseDown as (this: HTMLElement, ev: MouseEvent) => any);
    element?.ownerDocument.removeEventListener('mouseup' , mouseUp);
    element?.removeEventListener('mousemove', mouseMove as (this: HTMLElement, ev: MouseEvent) => any);

    element?.addEventListener('mousedown', mouseDown as (this: HTMLElement, ev: MouseEvent) => any);
    element?.ownerDocument.addEventListener('mouseup',mouseUp);
    element?.addEventListener('mousemove',mouseMove as (this: HTMLElement, ev: MouseEvent) => any);
}

// function to set the top and bottom simple banners
// determines the banners width 
function setBanners() : void {
    if (document.getElementById("tobBanner") && document.getElementById("bottomBanner"))
    {   let topBannerSVG=document.getElementById("topBanner")!.querySelector(".patternContainer") as HTMLElement;
        let bottomBannerSVG=document.getElementById("bottomBanner")!.querySelector(".patternContainer") as HTMLElement;
	    let svgWidth=window.innerWidth*0.9-(window.innerWidth*0.9%55)+10;
    
	    topBannerSVG.style.width=svgWidth + 'px';
	    topBannerSVG.style.right=(window.innerWidth-svgWidth)/window.innerWidth*50 + '%';

	    bottomBannerSVG.style.width=svgWidth + 'px';
	    bottomBannerSVG.style.left=(window.innerWidth-svgWidth)/window.innerWidth*50 + '%';
    }
}

// function to set the stroke dash array and stroke dash offset of the four circles in the 
// background. effectively, this will hide the visible one fourth of each circle, which
// later gets animated back into full circles. this is done to give the illusion of the 
// circle rotating at the very beginning of the page loading

function setBackgroundShapes(radius: number | undefined) : void {
    if (!radius){console.log("radius is false"); return;}
    const circumference  = 2* Math.PI * radius;
    const quadrant  = Math.PI * 0.5 * radius;
    const circles = Array.from(document.getElementsByClassName("bgCicle") as HTMLCollectionOf<HTMLElement>);
    circles.forEach(
        (circle, index)=>{
            //multiplied by one point one to ensure that shifted circles are fully invisible in the begininng
            
            circle.style.strokeDasharray=`${circumference-quadrant} ${quadrant*1.1}`;
	        circle.style.strokeDashoffset=index>1?quadrant.toString():(3*quadrant).toString();
        }
    );
}

let headerChildren : Element[] | null;
let header : HTMLElement | null;
let guide : HTMLElement | null;
let content1Wrapper : HTMLElement | null;
let tab1Options : Element[] | null;

// function that executes once the DOM in index.html is fully loaded
// attaches even listeneres to various elements and starts up the loading
// animations
// specific actions are explained by line basis
document.addEventListener("DOMContentLoaded",()=>{
    //  
    let activePod : HTMLElement | null;
    let currentTab = 'tab1';

    // appends the button template in index.html to every element with the button class
    Array.from(document.getElementsByClassName('button')).forEach(setButton);
    // appends the SVG template of up and down arrows in every scrollbar
    Array.from(document.querySelectorAll(".bottomButton,.topButton")).forEach(
        (element: Element) =>{
            let template = document.querySelector('template.svgCircle') as HTMLTemplateElement;
            element.appendChild(document.importNode(template.content,true));
        }
    );
    // appends the draggable grip SVG of a scrolling bar to every grip element in a scrolling
    // bar
    Array.from(document.getElementsByClassName("grip")).forEach(
        gripElement =>{
            let template = document.querySelector('template.gripTemplate') as HTMLTemplateElement;
            gripElement.appendChild(document.importNode(template.content,true));
        }
    );
    setBanners();
    // start the 1st animation in startup with sliding top and bottom banners
    animStart(updateBanner,300,document.getElementById("topBanner"),document.getElementById("bottomBanner"));
    // determine the setup of the SVG circles in the corners in startup
    setBackgroundShapes(document.getElementById("topLeftSmallCircle")?.getBoundingClientRect().width! / 2);
    // animates the background elements in succession of events, starting with window's load
    // then followed by animatesmallcircles
    window.addEventListener('load',()=>{
        let botRightBigCircleRadius = document.getElementById('botRightBigCircle') as SVGCircleElement | null;
        animStart(updateBgShapes,
            666,
            document.getElementById('topLeftBigCircle'),
            document.getElementById('botRightBigCircle'),
            botRightBigCircleRadius!.r.baseVal.value * Math.PI * 0.5,
            document.getElementById('topFirstLine'),
            document.getElementById("bottomFirstLine"),
            43,
            86,
            5
            );
    });
    // this is triggered by updateBgShapes when its playback reaches a certain amount
    document.getElementById("backgroundSVG")?.addEventListener("animateSmallCircles",()=>{
        let botRightBigCircleRadius = document.getElementById("botRightBigCircle") as SVGCircleElement | null;

        animStart(updateBgShapes,666,
            document.getElementById("topLeftSmallCircle"),
            document.getElementById("botRightSmallCircle"),
            botRightBigCircleRadius!.r.baseVal.value * Math.PI * 0.5,
            document.getElementById("topSecondLine"),
            document.getElementById("bottomSecondLine"),
            51,
            102,
            0
            );
    }, {once:true});
    // this event listener is followed by 'animateSmallCircles' and is triggered the same way:
    document.getElementById("backgroundSVG")?.addEventListener("animateThirdLines",()=>{
        animStart((playback: number, topThirdLine: HTMLElement, 
            bottomThirdLine : HTMLElement, xMagnitude : number, yMagnitude : number)=>{
                topThirdLine.setAttributeNS(null,'x2',`${Math.pow(playback,0.5)*xMagnitude}%`);
                topThirdLine.setAttributeNS(null,'y2',`${Math.pow(playback,0.5)*yMagnitude+6}%`);
                bottomThirdLine.setAttributeNS(null,'x2',`${100-Math.pow(playback,0.5)*xMagnitude}%`);
                bottomThirdLine.setAttributeNS(null,'y2',`${100-Math.pow(playback,0.5)*yMagnitude-6}%`);
        },
        666,
        document.getElementById("topThirdLine"),
        document.getElementById("bottomThirdLine"),46,86);
    },{once:true});
    header = document.getElementById("tab1ContentWrapper");
    if (header) headerChildren = Array.from(header.children);
    content1Wrapper = document.getElementById("tab1ContentWrapper");
    tab1Options = Array.from(document.getElementsByClassName("tab1"));
    guide = document.getElementById("guide");
    /* HEADER ANIMATION */
    header?.addEventListener('playHeaderAnim',()=>{animStart(updateHeader, 304)},{once:true});
    content1Wrapper?.addEventListener('wrapper1Anim', ()=>{animStart(updateWrapper1, 289);}, {once:true});
    guide?.addEventListener("guideAnim",()=>{animStart(updateGuide, 289);}, {once:true});
    /* BACKGROUND ANIMATION */
    document.getElementById("backgroundSVG")?.addEventListener("animateBg",
     function(this : HTMLElement){
        setInterval(
        ()=>{
        let bgShapesDirection : true | false = false;
        
        Array.from(this.children as HTMLCollectionOf<HTMLElement>).forEach((shape : HTMLElement)=>{
            
            switch(shape.classList[0]){
                case "bgLine":
                    shape.style.transform = bgShapesDirection? 
                    `translate(${Math.random()*2}%,${Math.random()*2}%)` :
                    `translate(${Math.random()*1}%,${Math.random()*1}%)`;
                    break;
                    case "bgCircle":
                    shape.style.transform = bgShapesDirection?
                    `translate(${Math.random()*1}%,${Math.random()*2}%)` :
                    `translate(${Math.random()*1}%,${Math.random()*2}%)`;
                break;
            }
        });
        
        bgShapesDirection = !bgShapesDirection;},2500);
     },
     {once:true});
    /* ANIMATING THE HEADER */
    animateText(document.getElementById("title"));
    /* ADDING INTERACTIVITY */
    // for tab2, this will change the pod program text of the selected pod(activepod variable)
    // to the text in the middle menu option
    document.getElementById("tab2Midmenu")?.addEventListener("click" , (e)=>{
        if (e.target && ((<DOMMouseEvent>e).target.className === "tab2Option button")){
            setPodProgram((<DOMMouseEvent>e).target.id, activePod);
        }
    });
    // for tab2, change the third panel to reflect the option that is being hovered over
    // in the middle menu
    document.getElementById("tab2Midmenu")?.addEventListener("mouseover", (e)=>{
        if (e.target && (<DOMMouseEvent>e).target.className === "tab2Option button"){
            displayDescription('./descriptions/demo' + (<DOMMouseEvent>e).target.id.slice(6) + '.html');
            (<HTMLIFrameElement>document.getElementById("descriptionContainer")).contentWindow?.addEventListener("keydown",(e)=>{
				// .pop exclamation mark assertion is made as it matters not whether the stack
                // is empty or not
                if (e.key == 'Escape' && stack.length != 0) {  stack.pop()!.back(); }
				});
        }
    });
    /* tab2 pod SPAN elements interactivity */
    document.getElementById("tab2Content")?.addEventListener("click",function(e){
        if ((<DOMMouseEvent>e).target.nodeName === "SPAN"){
            // display the pod program options menu if not already visible
            if (document.getElementById("tab2MidmenuWrapper")?.style.display === "none"){
                // display appropriate message on the guide bar
                setGuideElements("Select Pod program to equip.",
                 document.querySelector("template.guideButtonTemplate") as HTMLTemplateElement);
                // display appropriate message on the header's sub title
                document.getElementById("subTitle")!.textContent+=": ";
                animateText(document.getElementById("subTitle"),0,(<DOMMouseEvent>e).target.id,true);
                // animate the mid menu with the fade in animation to make it visible
                animStart(fadeIn, 208, document.getElementById("tab2MidmenuWrapper"), "inline-flex");
                // make the menu scrollable 
                setSideBar(document.getElementById("midMenuSidebar"));
            }
            // set all of the pod SPAN elements to not pressed and set the clicked SPAN to be
            // the chosen pod
            Array.from(document.getElementsByClassName("tab2") as HTMLCollectionOf<HTMLSpanElement>).forEach(
                (pod : HTMLSpanElement)=>{pod.dataset.pressed = "false"; });
            (<DOMMouseEvent>e).target.dataset.pressed = "true";
            activePod = setPod((<DOMMouseEvent>e).target.id);
            // indicate selection with the updateProperty animation (draws arrow)
            animStart(updateProperty, 208, "--afterVisibility",this);
            // add a layer that enables the user to press Esc to remove the mid menu
            addToStack({eventName: "disableTab2Menu",
             back: function(){
                animStart(fadeOut, 208, [document.getElementById("tab2MidmenuWrapper")],
                0,
                "backTotab2Content",
                true);
            }});
            // dispatched once the user presses Esc with the mid menu visible
            // resets the chosen pod to no selection visually and technically
            document.addEventListener("backTotab2Content",()=>{
                animStart(updateProperty, 208, "--afterVisibility", this, true);
                activePod = setPod();
                (<DOMMouseEvent>e).target.dataset.pressed = "false";
                setGuideElements("Select Pod");
                document.getElementById("subTitle")!.textContent = "-Pod Programs";
                }, {once:true});
        }
    });
    document.getElementById("tab2Content")?.addEventListener('mouseover', (event) => {
		// color the SPAN pod element that is being hovered over if the mid menu is invisible
        if ((<DOMMouseEvent>event).target.nodeName == "SPAN" &&
         document.getElementById("tab2MidmenuWrapper")?.style.display == "none") 
         {
            // set the 3rd panel to display the pod program on the SPAN element being hovered over
			displayDescription('./descriptions/demo' + (<DOMMouseEvent>event).target.dataset.program?.slice(6) + '.html');
			// show the 3rd panel if not already visible by animating it with fadeIn
            if (document.getElementById("descriptionContainer")?.style.display == 'none')
				animStart(fadeIn, 167, document.getElementById("descriptionContainer"), "block");
            // done for coloration
            (<DOMMouseEvent>event).target.dataset.pressed = 'true';
        }
	});
    // reverses coloration if the user only hovers over a pod SPAN element without clicking it
    document.getElementById("tab2Content")?.addEventListener('mouseout', (event) => {
        if ((<DOMMouseEvent>event).target.nodeName == 'SPAN' && activePod == null)
         { (<DOMMouseEvent>event).target.dataset.pressed = 'false'; }
	});
    // INTERACTIVITY FOR TAB1 NESTED CONTENT 
    document.getElementById("tab1nestedContent")?.addEventListener("mouseover",function(event){
        // ensure that the mouse is hovering over an option && no archive is clicked on
        // how did the original script get away with only two equal signs here?
        if ((<DOMMouseEvent>event).target.className == "nested button" && 
            document.getElementById("tab1DocumentHeader")?.dataset?.pressed === "false"){
                // change the iframe src to reflect the content of the option being hovered over
                document.getElementById("tab1Document")?.setAttribute("src","./dummy.html");
                // show a display window showcasing the contents of the option. the header is seperate from the iframe
                display("tab1DocumentHeader","flex");
                display("tab1Document");
                (<HTMLIFrameElement>document.getElementById("tab1Document"))?.contentWindow?.addEventListener("keydown",(event)=>{
                    if (event.key === "Escape" && stack.length !== 0) stack.pop()!.back();
                });
        }
    });
    document.getElementById("tab1nestedContent")?.addEventListener("click", function (event){
        if ((<DOMMouseEvent>event).target.className === "nested button"){
            // done to trigger CSS colorations/animations for the pressed button
            (<DOMMouseEvent>event).target.dataset.pressed = "true";
            // disable the mouse from interacting with this menu once an option is clicked
            this.style.pointerEvents = "none";
            // is this assertion fair? the HTML for this script is fixed
            document.getElementById("nestedContentSidebar")!.dataset.scrollable = "false";
            // purpose-defeating assertions
            (<HTMLIFrameElement>document.getElementById("tab1Document"))!.contentWindow!.document.getElementById("contentSidebar")!.dataset.scrollable = "true";
            document.getElementById("tab1DocumentHeader")!.dataset.pressed = "true";
            document.getElementById("subTitle")!.textContent += ": ";
            animateText(document.getElementById("subTitle"), 0,
            (<DOMMouseEvent>event).target.querySelector('.text')?.textContent, true);
            addToStack({eventName : "backtoNestedContent", 
            back: ()=>{
                document.getElementById("tab1DocumentHeader")!.dataset.pressed = "false";
                (<DOMMouseEvent>event).target.dataset.pressed = "false";
                // disallow the mouse from scrolling the archives window as this menu's option is no longer selected
                (<HTMLIFrameElement>document.getElementById("tab1Document"))!.contentWindow!.document.getElementById("contentSidebar")!.dataset.scrollable="false"; 
				// re-enable the mouse to scroll through this menu
                document.getElementById("nestedContentSidebar")!.dataset.scrollable="true";
                // re-enable the mouse to interact with this menu after pressing escape
                this.style.pointerEvents=""; 
				document.getElementById("subTitle")!.textContent="-Archives";
            }});
        }
    });
    document.getElementById("tab1Content")?.addEventListener("click", (event)=>{
        if ((<DOMMouseEvent>event).target.className === "tab1 button"){
            let pushedButton : HTMLElement = (<DOMMouseEvent>event).target;
            animStart(fadeOut, 128, [content1Wrapper], 0.7, pushedButton.className);
            document.addEventListener(pushedButton.className, ()=>{
                // events that occur after tab1Content fades out
                filter ("tabContent");
                // reset the positions of the tab 1 content buttons
                tab1Options?.forEach((option)=>{(<HTMLElement>option).style.right = "";
                (<HTMLElement>option).style.opacity = ""});
                content1Wrapper?.style.setProperty("--beforeHeight", null);
                setGuideElements("View the information archives");
                animateText(document.getElementById("subTitle"), 0, "-Archives");
                addToStack({
                    eventName : "backTotab1Content",
                // function to fade tab1Content back in should the user press ESC after choosing an option
                    back : function (){
                        animStart (fadeOut, 128, [document.getElementById("tab1nestedContentWrapper")], 
                        0.7, "backTotab1Content", true);
                        // triggered after the above animation finishes
                        document.addEventListener("backTotab1Content", ()=>{
                            if (content1Wrapper)  content1Wrapper.style.display = "flex";
                            animStart(updateWrapper1, 192);
                            setGuideElements("View various types of acquired data.");
                            if (document.getElementById("subTitle"))
                            document.getElementById("subTitle")!.textContent = "";
                        }, {once:true});
                    }
                });
                animStart(fadeIn, 128, document.getElementById("tab1nestedContentWrapper"),
                "grid");
                setSideBar(document.getElementById("nestedContentSidebar"));
                setScrolling(document.getElementById("nestedContentSidebar"));
            }, {once:true});
        }
    });
    // HEADER INTERACTIVITY (TAB1,2,3...)
    document.getElementById("header")?.addEventListener("click",(event)=>{
        // created for readability and mitigating frequent event.target access
        let pushedTab : HTMLElement= (<DOMMouseEvent>event).target;
        // ensure that the tab is not already pressed
        // how do i get away with two equal signs here? (it functions the same with three)
        if (pushedTab.className == "tab button" && pushedTab.id != currentTab){
            // contains the element that will be displayed, the kind of the display, 
            // and the name of the event that will trigger the fadeIn
            let transitionObject = {};
            // done to remove CSS styling
            document.getElementById(currentTab)!.dataset.pressed = "false";
            currentTab = pushedTab.id;
            // done to apply CSS rules in cssScript.css
            pushedTab.dataset.pressed = "true";
            switch(pushedTab.id){
                // tab specific operations and transitions
                
            }

        }
    });
});