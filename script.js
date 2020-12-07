var mydata = JSON.parse(data);
var icondata = JSON.parse(Sheets);
// var iconcode = a.weather[0].icon;

const NAME = "Adithya";
const WELCOME_MESSAGE_TEMPLATE = ["Night", "Morning", "Afternoon", "Evening"];

// All shortcuts are in a `SHORTCUT_STARTER+shortcutKey` format. 
// So, for example, pressing `tab+q` would redirect you to https://google.com/?q=q
const SHORTCUT_STARTER = 'tab' 

// How much time (in milliseconds) you have to press shortcutKey after pressing SHORTCUT_STARTER.
// Also change --SHORTCUT_TIMEOUT in styles.css if you change this option.
const SHORTCUT_TIMEOUT = 1500;

// The groups of links are generated from this object. Edit it to edit the page's contents.
// shortcutKey must hold an all-lowercase single button. Theoretically should work with values like `esc` and `f1`,
// but intended to be used with just regular latin letters.


let $container = document.getElementById("content");
let getUrl = {};

let $shortcutDisplayList = document.getElementsByClassName("shortcut");
let listeningForShortcut = false;
let listenerTimeout;

function setupWelcomeMessage(){
    let curHours = new Date().getHours();
    curHours = Math.floor(curHours/6); // Simply dividing current hours by 6 proves to be a good enough aproximation.
    if (curHours == 4) curHours = 3;
    let welcome = "Good " + WELCOME_MESSAGE_TEMPLATE[curHours] + ", " + NAME;    
    document.getElementById("welcome-string").innerHTML = welcome;
    let sno = Math.floor((Math.random() * 5000));
    document.getElementById('thalaivar').innerHTML=mydata[sno].quoteText + "<br>"+ "&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;"+" - "+ mydata[sno].quoteAuthor;

}


function setupGroups(){
    for (let i = 0; i < MASTER_MAP.length; i++){
        let curGroupData = MASTER_MAP[i];

        let group = document.createElement("div");
        group.className = "group";
        $container.appendChild(group);

        let header = document.createElement("h1");
        header.innerHTML = curGroupData.title;
        group.appendChild(header);

        for (let j = 0; j < curGroupData.links.length; j++){
            let curItemData = curGroupData.links[j];

            let pContainer = document.createElement("p");
            group.appendChild(pContainer);

            let link = document.createElement("a");
            link.innerHTML = curItemData.name;
            link.setAttribute("href", curItemData.url);
            pContainer.appendChild(link);

            // let shortcutDisplay = document.createElement("span");
            // shortcutDisplay.innerHTML = curItemData.shortcutKey;
            // shortcutDisplay.className = "shortcut";
            // shortcutDisplay.style.animation = "none";
            // pContainer.appendChild(shortcutDisplay);

            // getUrl[curItemData.shortcutKey] = curItemData.url
        }
    }
}

function shortcutListener(e) {
    let key = e.key.toLowerCase();

    if (listeningForShortcut && getUrl.hasOwnProperty(key)){
        window.location = getUrl[key];
    }

    if (key === SHORTCUT_STARTER) {
        clearTimeout(listenerTimeout);
        listeningForShortcut = true;

        // Animation reset
        for (let i = 0; i < $shortcutDisplayList.length; i++){
            $shortcutDisplayList[i].style.animation = "none";
            setTimeout(function() { $shortcutDisplayList[i].style.animation = ''; }, 10);
        }

        listenerTimeout = setTimeout(function(){ listeningForShortcut = false; }, SHORTCUT_TIMEOUT);
    }
}

function main(){
    getWeather();
        document.getElementById("clock").innerHTML = getTime();
        setInterval(() => {
          document.getElementById("clock").innerHTML = getTime();
        }, 100);
    setupWelcomeMessage();
    setupGroups();
    document.addEventListener('keyup', shortcutListener, false);

}
window.onload = () => {

      };

function getTime() {
        let date = new Date(),
          min = date.getMinutes(),
          sec = date.getSeconds(),
          hour = date.getHours();

        return (
          "" +
          (hour < 10 ? "0" + hour : hour) +
          ":" +
          (min < 10 ? "0" + min : min) +
          ":" +
          (sec < 10 ? "0" + sec : sec)
        );
      }
function showLat(position) {
        return position.coords.latitude.toString();
      }     
      function showLon(position) {
        return position.coords.longitude.toString();
      }      
      // Handle Weather request
      function getWeather() {
        let xhr = new XMLHttpRequest();
        var iconcode = "";
        var iconurl = "";
        //Request to open weather map
        xhr.open(
          "GET",
          "http://api.openweathermap.org/data/2.5/weather?id=1264527&units=metric&appid=e5b292ae2f9dae5f29e11499c2d82ece"
        );
        xhr.onload = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {

              let json = JSON.parse(xhr.responseText);
              document.getElementById("temp").innerHTML =
                json.main.temp.toFixed(0) + " C";
              document.getElementById("weather-description").innerHTML =
                json.weather[0].description;
              for (var i = icondata.length - 1; i >= 0; i--) {
              	if((icondata[i].DESCRIPTION).localeCompare(json.weather[0].description)==0)
              	{	
              		iconurl = "http://openweathermap.org/img/wn/" + icondata[i].ICON + ".png"
              	}
              }
            img = document.createElement('img');
			img.src = iconurl;
			document.getElementById('icon').appendChild(img);
            } else {
              console.log("error msg: " + xhr.status);
            }
          }
        };
        xhr.send();

		

      }

main();
