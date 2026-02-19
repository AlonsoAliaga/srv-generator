let activeLanguage;
let defaultLanguageData;
let defaultLanguageKeys;
const logger = false;
const logMode = false;
const loggerPrefix = logger ? `[LANGUAGE]` : ""
const loggerHtmlPrefix = logger ? `[HTML]` : ""
const loggerMissingPrefix = logger ? `[MISSING]` : ""
let currentViewers = 0;
let onlineViewersMessages = [
  "🟢 {VIEWERS} online perfecting placeholder output quietly!"
]
let currentLanguage = "en";
let t = false;
let baseImagesUrl = !t ? "https://raw.githubusercontent.com/AlonsoAliaga/srv-generator/main/assets/flags/{LANG}.png" : "../assets/images/{LANG}.png";
let baseLangFlagUrl = !t ? "https://raw.githubusercontent.com/AlonsoAliaga/srv-generator/main/assets/flags/{LANG}.png" : "../assets/flags/{LANG}.png";
//let baseLangFlagUrl = "../assets/flags/{LANG}.png";

let baseLangFileUrl = !t ? "https://raw.githubusercontent.com/AlonsoAliaga/srv-generator/main/docs/lang/{LANG}.json" : "./lang/{LANG}.json";
//let baseLangFileUrl = "./lang/{LANG}.json";
let availableLanguages = ["en","es","fr","it"]
let defaultLanguage = availableLanguages[0]
const langsData = new Map();

let alertTimout;
function alertLanguageNotAvailable(userLang){
  if(alertTimout) {
    clearTimeout(alertTimout);
    var sb = document.getElementById("csnackbar");
    sb.className = sb.className.replace("show", "");
  }
  var sb = document.getElementById("csnackbar");

  //this is where the class name will be added & removed to activate the css
  sb.className = "show";
  sb.innerHTML = `❌ Couldn't find a translation for '${userLang}' language 😔<br>Be the one who give the <a href="https://alonsoaliaga.com/discord" rel="noopener" target="_blank">translation here</a>!`

  alertTimout = setTimeout(()=>{ sb.className = sb.className.replace("show", ""); }, 3000);
}
loadLanguages();
async function loadLanguages() {
  let userLang = resolveLanguage();
  if(!availableLanguages.includes(userLang)) {
    alertLanguageNotAvailable(userLang);
    userLang = defaultLanguage;
  }
  currentLanguage = userLang;
  for(let lang of availableLanguages) {
    let data = await onlyLoadAndReturnLanguage(lang);
    if(data) {
      if(lang == "en") {
        defaultLanguageData = data;
        defaultLanguageKeys = Object.keys(data);
      }
      langsData.set(lang,data);
    }
  }
  let flagsDiv = document.getElementById("flags-section");
  for(let [key,data] of langsData) {
    let img = document.createElement("img");
    img.src = baseLangFlagUrl.replace("{LANG}",key);
    img.classList.add("flag");
    img.onclick = function() {
      currentLanguage = key;
      applyTranslations(data);
      return false;
    }
    flagsDiv.appendChild(img)
  }
  applyTranslations(langsData.get(userLang))
  //applyTranslations(langsData.get("en"))
  //updateRecords();
}
//loadDefaultLanguage();
function resolveLanguage() {
    //return "ens"
    // Try getting the user's preferred language from the most reliable source
    if (navigator.languages && Array.isArray(navigator.languages) && navigator.languages.length > 0) {
        return navigator.languages[0].split('-')[0].toLowerCase(); // e.g., "es-ES" -> "es"
    }
    // Fallback to other known navigator properties (cross-browser)
    if (typeof navigator.language === 'string') {
        return navigator.language.split('-')[0].toLowerCase();
    }
    if (typeof navigator.userLanguage === 'string') {
        return navigator.userLanguage.split('-')[0].toLowerCase();
    }
    if (typeof navigator.browserLanguage === 'string') {
        return navigator.browserLanguage.split('-')[0].toLowerCase();
    }
    if (typeof navigator.systemLanguage === 'string') {
        return navigator.systemLanguage.split('-')[0].toLowerCase();
    }
    // Final fallback
    return defaultLanguage.toLowerCase();
}
function toggleDarkmode() {
    if (document.getElementById('darkmode').checked == true) {
      document.body.classList.add('dark');
      //document.getElementById('result').classList.add("darktextboxes");
      for(let d of [...document.querySelectorAll(".lightbuttonboxes")]) {
        //let d = document.getElementById(n);
        if(d) {
          d.classList.remove("lightbuttonboxes");
          d.classList.add("darkbuttonboxes");
        }
      }
      let success = document.getElementById('success_message');
      if(success) {
        success.classList.remove("successlight");
        success.classList.add("successdark");
      }
    } else {
      document.body.classList.remove('dark');
      //document.getElementById('result').classList.remove("darktextboxes");
      //Buttons
      for(let d of [...document.querySelectorAll(".darkbuttonboxes")]) {
        //let d = document.getElementById(n);
        if(d) {
          d.classList.remove("darkbuttonboxes");
          d.classList.add("lightbuttonboxes");
        }
      }
      let success = document.getElementById('success_message');
      if(success) {
        success.classList.remove("successdark");
        success.classList.add("successlight");
      }
    }
    //console.log("Dark mode is now: "+(document.getElementById('darkmode').checked))
}
let options = {
  "equals": "equals",
  "ignorecase": "ignorecase",
  "ignorecolor": "ignorecolor",
  "contains": "contains",
  "greaterorequal": ">=",
  "greater": ">",
  "lowerorequal": "<=",
  "lower": "<",
}
let times = 0;
function loadCounter() {
 let href = window.location.href;
 if(!href.includes(atob("YWxvbnNvYWxpYWdhLmdpdGh1Yi5pbw=="))) return;
 let link = atob("aHR0cHM6Ly9hbG9uc29hcGkuZGlzY2xvdWQuYXBwL2NvdW50ZXI/c2l0ZT08c2l0ZT4ma2V5PTxrZXk+")
  .replace(/<site>/g,"srv-generator").replace(/<key>/g,"KEY-A");
 let counter = document.getElementById("visitor-counter");
 //console.log(link)
 if(counter) {
   $.ajax({
     url: link,
     type: "GET", /* or type:"GET" or type:"PUT" */
     dataType: "json",
     data: {
     },
     success: function (result) {
       if(isNaN(result))
         document.getElementById("counter-amount").innerHTML = "Click to return!";
       else document.getElementById("counter-amount").innerHTML = `Visits: ${result}`;
     },
     error: function (e) {
       times++;
       document.getElementById("counter-amount").innerHTML = "Click to return!";
       if(times <= 1) {
        setTimeout(()=>{
          loadCounter();
        },1000*10);
       }
     }
   });
 }
}
function getRandomViewersMessage() {
  return onlineViewersMessages[Math.floor(Math.random() * onlineViewersMessages.length)]
}
function updateOnlineMessage() {
  if(currentViewers != -1) {
    let newMessage = getRandomViewersMessage();
    let counter = document.getElementById("online-counter");
    counter.textContent = newMessage.replace(/{VIEWERS}/g,currentViewers)
  }
}
let presets = {
  "luckpermsrankorpurchase": {
    name: "[HTML]Shows Luckperms rank prefix or \"<span style='color:rgb(255, 76, 76);font-family: MinecraftBold'>Purchase a rank!</span>\"",
    data:{
      "generator-input": "{luckperms_prefix}",
      "generator-rule": "equals",
      "generator-matcher": "",
      "generator-return-match": "&cPurchase a rank!",
      "generator-return-fail": "{luckperms_prefix}",
    }
  },
  "vaultrankorpurchase": {
    name: "[HTML]Shows vault rank prefix or \"<span style='color:rgb(255, 76, 76);font-family: MinecraftBold'>Purchase a rank!</span>\"",
    data:{
      "generator-input": "{vault_prefix}",
      "generator-rule": "equals",
      "generator-matcher": "",
      "generator-return-match": "&cPurchase a rank!",
      "generator-return-fail": "{vault_prefix}",
    }
  },
  "betterteamsname": {
    name: "[HTML]Show BetterTeams team name or \"<span style='color:rgb(255, 76, 76);font-family: MinecraftBold'>No Team!</span>\"",
    data: {
      "generator-input": "{betterTeams_name}",
      "generator-rule": "equals",
      "generator-matcher": "",
      "generator-return-match": "&cNo team!",
      "generator-return-fail": "{betterTeams_name}"
    }
  },
  "hasenoughmoney": {
    name: "[HTML]If player has enough money, \"<span style='color:rgb(84, 216, 58);font-family: MinecraftBold'>Can be purchased!</span>\" or \"<span style='color:rgb(255, 76, 76);font-family: MinecraftBold'>Not enough money!</span>\"",
    data:{
      "generator-input": "{vault_eco_balance}",
      "generator-rule": "greaterorequal",
      "generator-matcher": "1000",
      "generator-return-match": "&aCan be purchased!",
      "generator-return-fail": "&cNot enough money!",
    }
  },
  "isonline": {
    name: "[HTML]If player is online, \"<span style='color:rgb(84, 216, 58);font-family: MinecraftBold'>Online</span>\" or \"<span style='color:rgb(255, 76, 76);font-family: MinecraftBold'>Offline</span>\"",
    data: {
      "generator-input": "{player_online}",
      "generator-rule": "equals",
      "generator-matcher": "true",
      "generator-return-match": "&aOnline",
      "generator-return-fail": "&cOffline",
    }
  },
  "hasrankpermission": {
    name: "[HTML]If player has rank permission, \"<span style='color:rgb(84, 216, 58);font-family: MinecraftBold'>Rank Unlocked</span>\" or \"<span style='color:rgb(255, 76, 76);font-family: MinecraftBold'>Locked</span>\"",
    data: {
      "generator-input": "{permission_has_permission.for.rank}",
      "generator-rule": "equals",
      "generator-matcher": "true",
      "generator-return-match": "&aRank Unlocked",
      "generator-return-fail": "&cLocked",
    }
  },
  "canfly": {
    name: "[HTML]If player can fly, \"<span style='color:rgb(84, 216, 58);font-family: MinecraftBold'>Flight available!</span>\" or \"<span style='color:rgb(255, 76, 76);font-family: MinecraftBold'>Flight disabled!</span>\"",
    data: {
      "generator-input": "{player_allow_flight}",
      "generator-rule": "equals",
      "generator-matcher": "true",
      "generator-return-match": "&aFlight available!",
      "generator-return-fail": "&cFlight disabled!",
    }
  },
    "sleepingstatus": {
    name: "[HTML]If player is sleeping, \"<span style='color:rgb(65, 62, 211);font-family: MinecraftBold'>Sleeping</span>\" when in bed or Empty",
    data: {
      "generator-input": "{player_is_sleeping}",
      "generator-rule": "equals",
      "generator-matcher": "true",
      "generator-return-match": "&7Sleeping",
      "generator-return-fail": ""
    }
  },
}
function loadPreset(key,data) {
  if(!key || !data) {
    return;
  }
  for(let id of Object.keys(data.data)) {
    let element = document.getElementById(id);
    if(element) {
      element.value = data.data[id];
    }
  }
  updateFixOptionContains();

}
function processAds() {
  
}
/*
for(let id of ["ip-to-connect","numerical-ip","server-port"]) {
  let element = document.getElementById(id);
  if(element) {
    element.addEventListener('keyup',()=>{
      updateRecords();
    });
  }
}
*/
function loadChecking() {
 let href = window.location.href;
 if(!href.includes(atob("YWxvbnNvYWxpYWdhLmdpdGh1Yi5pbw=="))) return;
 let link = atob("aHR0cHM6Ly9hbG9uc29hcGkuZGlzY2xvdWQuYXBwL2NoZWNraW5nP3NpdGU9PHNpdGU+JmtleT08a2V5PiZsb2NrPTxsb2NrPg==")
  .replace(/<site>/g,"srv-generator").replace(/<key>/g,"KEY-A")
  .replace(/<lock>/g,(typeof window.getRandomStyle == "undefined" || myTimeout != undefined || typeof adBlockEnabled == "undefined" || adBlockEnabled) ? "yes" : "no");
 let counter = document.getElementById("online-counter");
 if(counter) {
   $.ajax({
     url: link,
     type: "GET", /* or type:"GET" or type:"PUT" */
     dataType: "json",
     data: {
     },
     success: function (result) {
        //console.log(`Total fails: ${counter.dataset.failed}`)
        counter.dataset.failed = "0";
        counter.style.display = "flex";
        /*
        if(true){
          currentViewers = -999;
          //counter.textContent = `🟢 ${result} user${result==1?``:`s`} online using our Minecraft Profile Picture Generator!`;
          counter.textContent = getRandomViewersMessage().replace(/{VIEWERS}/g,"999");
          counter.style.backgroundColor = "green";
        }else 
        */
        if(isNaN(result)) {
          counter.textContent = `🟡 You shouldn't be reading this. Report it on https://alonsoaliaga.com/discord`;
          counter.style.backgroundColor = "yellow";
          currentViewers = -1;
        }else{
          currentViewers = +result;
          //counter.textContent = `🟢 ${result} user${result==1?``:`s`} online using our Minecraft Profile Picture Generator!`;
          counter.textContent = getRandomViewersMessage().replace(/{VIEWERS}/g,result);
          counter.style.backgroundColor = "green";
        }
     },
     error: function (e) {
      //console.log(`Total fails: ${counter.dataset.failed}`)
      if(counter.style.display != "none") {
        let currentFails = +counter.dataset.failed;
        if(currentFails >= 1){
          counter.style.display = "none"
        }else{
          counter.textContent = `🔴 Check your internet connection!`;
          counter.style.backgroundColor = "#7c0000";
          counter.dataset.failed = `${currentFails + 1}`
        }
      }
     }
   });
 }
}
window.addEventListener("DOMContentLoaded",()=>{
  loadCounter();
  checkSite(window);
  setTimeout(()=>{
    loadChecking();
    setInterval(()=>{
      loadChecking();
    },10000)
  },2500)
});
function checkSite(window) {
  let search = window.location.search;
  /*
  if(typeof search !== "undefined" && search.length > 0) {
    let parts = atob(search.slice(1)).split("&");
    for(let part of parts) {
      let [k,v] = part.split("=");
      k = btoa(k);
      if(k == "dXNlcm5hbWU=") {
        if(v.match(/[a-z0-9_]/gi)) {
          setTimeout(()=>{
            usernameInput.value = v;
            processUsername();
          },500);
        }
      }
    }
  }
  */
  setTimeout(()=>{
    let href = window.location.href;
    if(!href.includes(atob("YWxvbnNvYWxpYWdhLmdpdGh1Yi5pbw=="))) {
      try{document.title = `Page stolen from https://${atob("YWxvbnNvYWxpYWdhLmdpdGh1Yi5pbw==")}`;}catch(e){}
      window.location = `https://${atob("YWxvbnNvYWxpYWdhLmdpdGh1Yi5pbw==")}/srv-generator/`}
  });
  fetch('https://raw.githubusercontent.com/AlonsoAliaga/AlonsoAliagaAPI/refs/heads/main/api/tools/tools-list.json')
    .then(res => res.json())
    .then(content => {
      let toolsData = content;
      let toolsArray = []
      for(let toolData of toolsData) {
        let clazz = typeof toolData.clazz == "undefined" ? "" : ` class="${toolData.clazz}"`;
        let style = typeof toolData.style == "undefined" ? "" : ` style="${toolData.style}"`;
        toolsArray.push(`<span>💠</span> <span${clazz}${style}><a title="${toolData.description}" id="tool-priority-${toolData.priority}" href="${toolData.link}">${toolData.name}</a></span>`);
      }
      document.getElementById("tools-for-you").innerHTML = toolsArray.join(`<br>`);
    });
}
function copyTextToClipboard(text) {
  let textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.bottom= 0;
  textArea.style.left= 0;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  document.execCommand('copy');
  alertCopied();
  document.body.removeChild(textArea);
}
function getTranslation(key) {
  if(!currentLanguage) {
    let userLang = resolveLanguage();
    if(!availableLanguages.includes(userLang)) {
      alertLanguageNotAvailable(userLang);
      userLang = defaultLanguage;
    }
    currentLanguage = userLang;
  }
  let data = langsData.get(currentLanguage);
  //let data = langsData.get("en");
  return data[key] ||  `Unknown key`;
}
let alertMessageTimeout;
function alertMessage(key = "Empty message!") {
  if(alertMessageTimeout) {
    clearTimeout(alertMessageTimeout);
    var sb = document.getElementById("msnackbar");
    sb.className = sb.className.replace("show", "");
  }
  let message = getTranslation(key);
  var sb = document.getElementById("msnackbar");
  if(message.startsWith("[HTML]")) {
    sb.innerHTML = message.replace("[HTML]",""); 
  }else{
    sb.textContent = message; 
  }

  //this is where the class name will be added & removed to activate the css
  sb.className = "show";

  alertMessageTimeout = setTimeout(()=>{ sb.className = sb.className.replace("show", ""); }, 3000);
}
let copiedTimeout;
function alertCopied() {
  if(copiedTimeout) {
    clearTimeout(copiedTimeout);
    var sb = document.getElementById("snackbar");
    sb.className = sb.className.replace("show", "");
  }
  var sb = document.getElementById("snackbar");

  //this is where the class name will be added & removed to activate the css
  sb.className = "show";

  copiedTimeout = setTimeout(()=>{ sb.className = sb.className.replace("show", ""); }, 3000);
}
async function onlyLoadAndReturnLanguage(lang) {
    if(logMode)console.log(`Only loading language '${lang}'..`)
    let link = baseLangFileUrl.replace("{LANG}",lang);
    try {
        //const res = await fetch(`./lang/${lang}.json`);
        if(false) {

          if(logMode)console.log(`Only loaded language '${lang}'!`)
          return data;
        }else{
          const res = await fetch(link);
          if (!res.ok) throw new Error();
          const data = await res.json();
          if(logMode)console.log(`Only loaded language '${lang}'!`)
          return data;
        }
    } catch(e) {
        console.log(`Error only loading '${lang}' from '${link}':`);
        console.error(e);
    }
    updateRecords();
}
function applyTranslations(data) {
    if(logMode)console.log(`Applying language '${activeLanguage}'..`)
    for (const expectedKey of defaultLanguageKeys) {
        if(expectedKey == "online-viewers") {
          if(typeof data[expectedKey] == "undefined") {
            onlineViewersMessages = defaultLanguageData[expectedKey];
            updateOnlineMessage();
          }else{
            onlineViewersMessages = data[expectedKey];
            updateOnlineMessage();
          }
          continue;
        }
        const elem = document.querySelector(`[data-i18n="${expectedKey}"]`);
        if(!elem) {
            if(logMode)console.log(`Element with data-i18n='${expectedKey}' is invalid. Skipping..`)
            continue;
        }
        if(typeof data[expectedKey] == "undefined") {
            let value = defaultLanguageData[expectedKey];
            if(logMode)console.log(`Missing translation for data-i18n="${expectedKey}" for '${activeLanguage}'. Using ${defaultLanguage}: ${value}`)
            if(value.startsWith("[HTML]")) {
                elem.innerHTML = `${loggerPrefix}${loggerHtmlPrefix}${loggerMissingPrefix}${value.replace("[HTML]","")}`;
            }else{
                elem.textContent = `${loggerPrefix}${loggerMissingPrefix}${value}`;
            }
        }else{
            let value = data[expectedKey];
            if(logMode)console.log(`Translating data-i18n="${expectedKey}" with element='${elem.id}' to '${activeLanguage}': ${value}`)
            if(value.startsWith("[HTML]")) {
                elem.innerHTML = `${loggerPrefix}${loggerHtmlPrefix}${value.replace("[HTML]","")}`;
            }else{
                elem.textContent = `${loggerPrefix}${value}`;
            }
        }
    }
    updateRecords();
}
let versionJavaButton = document.getElementById("version-java");
let versionBedrockButton = document.getElementById("version-bedrock");
let javaWholeSection = document.getElementById("java-whole-section");
let bedrockWholeSection = document.getElementById("bedrock-whole-section");
let javaOptionsSection = document.getElementById("java-options-section");
let bedrockOptionsSection = document.getElementById("bedrock-options-section");
function toggleJava() {
  let java = versionJavaButton.classList.contains("version-checked");
  let bedrock = versionBedrockButton.classList.contains("version-checked");
  if(java && !bedrock) {
    alertMessage(`select-one-version`)
    return;
  }
  versionJavaButton.classList.toggle("version-checked");
  updateRecords();
}
function toggleBedrock() {
  let bedrock = versionBedrockButton.classList.contains("version-checked");
  let java = versionJavaButton.classList.contains("version-checked");
  if(bedrock && !java) {
    alertMessage(`select-one-version`)
    return;
  }
  versionBedrockButton.classList.toggle("version-checked");
  updateRecords();
}
let myTimeout;
let mainDomainToConnectDiv = document.getElementById("main-domain-to-connect");
let javaSubdomainToConnectDiv = document.getElementById("java-subdomain-to-connect");
let bedrockSubdomainToConnectDiv = document.getElementById("bedrock-subdomain-to-connect");
let numericalIpDiv = document.getElementById("numerical-ip");
let javaPortDiv = document.getElementById("java-port");
let bedrockPortDiv = document.getElementById("bedrock-port");

let aRecordNameDiv = document.getElementById("a-record-name");
let aRecordIPv4Div = document.getElementById("a-record-ipv4");

let aBedrockRecordNameDiv = document.getElementById("bedrock-a-record-name");
let aBedrockRecordIPv4Div = document.getElementById("bedrock-a-record-ipv4");

let srvRecordNameDiv = document.getElementById("srv-record-name");
let srvRecordPortDiv = document.getElementById("srv-record-port");
let srvRecordTargetDiv = document.getElementById("srv-record-target");

let javaInstructionDiv = document.getElementById("java-instruction");
let bedrockInstructionDiv = document.getElementById("bedrock-instruction");
function updateRecords() {
  let java = versionJavaButton.classList.contains("version-checked");
  let bedrock = versionBedrockButton.classList.contains("version-checked");
  //console.log(`Updating records! Java=${java?`✅`:`❌`} Bedrock=${bedrock?`✅`:`❌`}`);
  javaSubdomainToConnectDiv.value = javaSubdomainToConnectDiv.value.replace(/\./g,"")
  let javaSubdomain = javaSubdomainToConnectDiv.value || "@";
  bedrockSubdomainToConnectDiv.value = bedrockSubdomainToConnectDiv.value.replace(/\./g,"")
  let bedrockSubdomain = bedrockSubdomainToConnectDiv.value || "@";
  //console.log(`Java subdomain: '${javaSubdomain}'`)
  //console.log(`Bedrock subdomain: '${bedrockSubdomain}'`)

  numericalIpDiv.value = numericalIpDiv.value.replace(/[^0-9.]/g,"");

  let mainDomain = mainDomainToConnectDiv.value;
  //console.log(`Domain: '${mainDomain}'`)

  let numericalIp = formatIpAddress(numericalIpDiv.value);
  //console.log(`Numerical ip: '${numericalIp}'`)
  aRecordIPv4Div.innerText = numericalIp;
  aBedrockRecordIPv4Div.innerText = numericalIp;


  let useGeneral = javaSubdomain == bedrockSubdomain;
  if(useGeneral) {
    document.getElementById("general-whole-section").style.display = "flex";
    document.getElementById("general-a-record-name").innerText = javaSubdomain;
    document.getElementById("general-a-record-ipv4").innerText = numericalIp;
  }else{
    document.getElementById("general-whole-section").style.display = "none";
  }

  aRecordNameDiv.innerText = javaSubdomain;
  aBedrockRecordNameDiv.innerText = bedrockSubdomain;

  if(java) {
    javaPortDiv.value = javaPortDiv.value.replace(/[^0-9]/g,"")
    let port = !javaPortDiv.value || isNaN(javaPortDiv.value) ? 25565 : parseInt(javaPortDiv.value);
    //console.log(`Java port: ${port}`);
    //console.log(`Java port: '${javaPortDiv.value}'`);

    srvRecordNameDiv.innerText = `_minecraft._tcp${javaSubdomain == "@" ? "" : `.${javaSubdomain}`}`;
    srvRecordPortDiv.innerText = port;
    srvRecordTargetDiv.innerText = `${javaSubdomain == "@" ? "" : `${javaSubdomain}.`}${mainDomain}`;

    javaWholeSection.style.display = "flex";
    javaOptionsSection.style.display = null;
    if(useGeneral) {
      document.getElementById("java-a-record-section").style.display = "none";
    }else{
      document.getElementById("java-a-record-section").style.display = "flex";
    }
    let instructionTranslation = getTranslation(`java-instruction`).replace(/{IP}/g,`${javaSubdomain == "@" ? "" : `${javaSubdomain}.`}${mainDomain}`);
    if(instructionTranslation.startsWith("[HTML]")) {
      javaInstructionDiv.innerHTML = instructionTranslation.slice(6);
    }else{
      javaInstructionDiv.innerText = instructionTranslation;
    }
  }else {
    javaWholeSection.style.display = "none";
    javaOptionsSection.style.display = "none";
  }
  if(bedrock) {
    bedrockPortDiv.value = bedrockPortDiv.value.replace(/[^0-9]/g,"")
    let port = !bedrockPortDiv.value || isNaN(bedrockPortDiv.value) ? 19132 : parseInt(bedrockPortDiv.value);
    //console.log(`Bedrock port: ${port}`);
    //console.log(`Bedrock port: '${bedrockPortDiv.value}'`);
    
    bedrockWholeSection.style.display = "flex";
    bedrockOptionsSection.style.display = null;
    if(useGeneral) {
      document.getElementById("bedrock-a-record-section").style.display = "none";
    }else{
      document.getElementById("bedrock-a-record-section").style.display = "flex";
    }
    let instructionTranslation = getTranslation(`bedrock-instruction`).replace(/{IP}/g,`${bedrockSubdomain == "@" ? "" : `${bedrockSubdomain}.`}${mainDomain}`)
      .replace(/{PORT}/g,port);
    if(instructionTranslation.startsWith("[HTML]")) {
      bedrockInstructionDiv.innerHTML = instructionTranslation.slice(6);
    }else{
      bedrockInstructionDiv.innerText = instructionTranslation;
    }
  }else {
    bedrockWholeSection.style.display = "none";
    bedrockOptionsSection.style.display = "none";
  }
}
function formatIpAddress(ipString) {
  const cleanedString = ipString.replace(/[^\d.]/g, '');
  let parts = cleanedString.split('.');
  if (parts.length > 4) {
    parts = parts.slice(0, 4);
  }
  while (parts.length < 4) {
    parts.push('0');
  }
  return parts.join('.');
}
// setTimeout(()=>{
//   updateRecords();
// },10)