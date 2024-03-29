var expansion = null;
var expansion_map = {};
var expansion_list = [];
var expansion_keys_list = [];

function loadExpansion(name,lang) {
  var xmlhttp = new XMLHttpRequest();
  var res = null;
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        parseExpansion(this,name,lang);
    }
  };
  xmlhttp.open("GET", "expansions.xml", true);
  xmlhttp.send();
}
async function loadExpansionList(lang) {
  expansion_list = [];
  var xmlhttp = new XMLHttpRequest();
  var res = null;
  xmlhttp.onreadystatechange = async function() {
    if (this.readyState == 4 && this.status == 200) {
        await getExpansions(this,lang);
    }
  };
  xmlhttp.open("GET", "expansions.xml", true);
  xmlhttp.send();
}

async function parseExpansion(xml,name,lang) {
  var expansions, i, xmlDoc, txt;
  xmlDoc = xml.responseXML;
  expansion_name = await parseElements(xmlDoc,"/expansions/expansion[@name='" + name + "']" + "/name[@lang='" + lang + "']");
  expansions_description = await parseElements(xmlDoc,"/expansions/expansion[@name='" + name + "']" + "/description[@lang='" + lang + "']");
  expansion_disclaimers = await parseElements(xmlDoc,"/expansions/expansion[@name='" + name + "']" + "/disclaimer[@lang='" + lang + "']");
  expansion_tasks = await parseElements(xmlDoc,"/expansions/expansion[@name='" + name + "']" + "/task/text[@lang='" + lang + "']");
  expansion_ids = await parseElements(xmlDoc,"/expansions/expansion[@name='" + name + "']" + "/task/id");

  console.log("IDS: " + expansion_ids);

  var tasks_map = {};
  var index = 0;
  expansion_ids.forEach(function(id){
    tasks_map[id] = expansion_tasks[index];
    index++;
  });

  expansion = {name:expansion_name,description:expansions_description,
    disclaimers:expansion_disclaimers,tasks:expansion_tasks,ids:expansion_ids,tasks_map:tasks_map};
  console.log(expansion.tasks_map);
  console.log(expansion);
}

async function getExpansions(xml,lang)
{
  var expansions, i, xmlDoc, txt;
  xmlDoc = xml.responseXML;

  expansion_ids = await parseElements(xmlDoc,"/expansions/expansion/id");
  expansion_names = await parseElements(xmlDoc,"/expansions/expansion/name[@lang='" + lang + "']");
  for (var i = 0; i < expansion_ids.length; i++)
  {
    expansion_map[expansion_ids[i]] = expansion_names[i];
    expansion_list.push(expansion_names[i]);
    expansion_keys_list.push(expansion_ids[i]);
  }
  console.log(expansion_map);
}
function parseElements(xmlDoc,xPath)
{
    var nodes = xmlDoc.evaluate(xPath, xmlDoc, null, XPathResult.ANY_TYPE,null);
    var result = nodes.iterateNext();
    elements = [];
    while(result)
    {
        elements.push(result.childNodes[0].nodeValue);
        result = nodes.iterateNext();
    }

    if(elements.length == 1)
    {
        return elements[0]
    }

    return elements;
}