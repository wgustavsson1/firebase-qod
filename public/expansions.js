var expansion = null;

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

async function parseExpansion(xml,name,lang) {
  var expansions, i, xmlDoc, txt;
  xmlDoc = xml.responseXML;
  expansion_name = await parseElements(xmlDoc,"/expansions/expansion[@name='" + name + "']" + "/name[@lang='" + lang + "']");
  expansions_description = await parseElements(xmlDoc,"/expansions/expansion[@name='" + name + "']" + "/description[@lang='" + lang + "']");
  expansion_disclaimers = await parseElements(xmlDoc,"/expansions/expansion[@name='" + name + "']" + "/disclaimer[@lang='" + lang + "']");
  expansion_tasks = await parseElements(xmlDoc,"/expansions/expansion[@name='" + name + "']" + "/task/text[@lang='" + lang + "']");
  

  expansion = {name:expansion_name,description:expansions_description,
    disclaimers:expansion_disclaimers,tasks:expansion_tasks};
  console.log(expansion);
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