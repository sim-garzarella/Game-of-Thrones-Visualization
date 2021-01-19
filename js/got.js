var width = 1500;
var height = 900;

var links = [];
var nodes = [];
var links2 = [];
var nodes2 = [];

var s, t = null;

var legend_height = 50;

function gotVis() {

    d3.json("../data/GoT.json", function(data) {
    
        nodes = data["nodes"];
        links = data["links"];

        // Formatting the Json
        // Converts source and target from String to Int
        links.forEach(link => {
            link.source = parseInt(link.source);
            link.target = parseInt(link.target);
        }); 

        //Array of characters' relations
        var notUniqueRelations = [];
        links.forEach(elem => {
            notUniqueRelations.push(elem.relation);
        })

        //deletes the duplicates
        var relations = deleteDuplicates(notUniqueRelations);   

        
        // Array of characters' groups
        var notUniqueGroups = [];
        nodes.forEach(elem => {
            notUniqueGroups.push(elem.group);
        })
        //deletes the duplicates
        var groups = deleteDuplicates(notUniqueGroups);

        /*
        // Array of characters' house-birth
        var notUniquehouse_birth = [];    
        nodes.forEach(elem => {
            notUniquehouse_birth.push(elem.house_birth);
        })
        //deletes the duplicates
        var house_birth = deleteDuplicates(notUniquehouse_birth);
        console.log(house_birth);

        // Array of characters' house-marriage
        var notUniqueHouse_marriage = [];
        nodes.forEach(elem => {
            notUniqueHouse_marriage.push(elem.house_marriage);
        })
        //deletes the duplicates
        var house_marriage = deleteDuplicates(notUniqueHouse_marriage);
        console.log(house_marriage);
        */

        // Force layout
        var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([width, height])
            .linkDistance(150)
            .charge(-375)
            .on("tick", tick)
            .start();  
        
        // Create the graph
        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height); 

        var link = svg.selectAll(".link")
            .data(force.links())
            .enter().append("line")
            .attr("class", function(d) {
                var source = d.source.id.toString();
                var target = d.target.id.toString();
                return ("link s" + source + " t" + target + " " +  d.relation);
            })

        var node = svg.selectAll(".node")
            .data(force.nodes())
            .enter().append("g")
            .attr("class", function(d) {
                if (d.group != undefined) {
                    return "node" + d.group.replace(/\s+/g, '').replace(/'/, '');}
                else return "node";
            })
            .attr("id", function(d) {
                return "node-" + d.id;
            })
            .on("mouseover",mouseover)
            .on("mouseout", mouseout)
            .call(force.drag);

        svg.selectAll(".node").append("circle")
            .attr("r", 20)
            .style("fill", "#ccc")
            .style("stroke", "#fff")
            .style("stroke-width", "2px");

        //Node shapes for different groups
        svg.selectAll(".nodeFreeFolk")
            .append('polygon')
            .attr('points', "25,20 0,-30 -25,20")
            .style("fill", "#ccc")
            .attr('stroke', '#fff')
            .style("stroke-width", "2px");

        svg.selectAll(".nodeBrotherhoodWithoutBanners")
            .append('rect')
            .attr("x", -20)
            .attr("y", -20)
            .attr("height", "40px")
            .attr("width", "40px")
            .style("fill", "#ccc")
            .attr('stroke', '#fff')
            .style("stroke-width", "2px");

        svg.selectAll(".nodeNightsWatch")
            .append('polygon')
            .attr('points', "15,20 -15,20 -25,0 -15,-20 15,-20 25,0")
            .style("fill", "#ccc")
            .attr('stroke', '#fff')
            .style("stroke-width", "2px");

        svg.selectAll(".nodeSandSnakes")
            .append('rect')
            .attr("x", -20)
            .attr("y", -30)
            .attr("height", "60px")
            .attr("width", "40px")
            .style("fill", "#ccc")
            .attr('stroke', '#fff')
            .style("stroke-width", "2px");
            
        svg.selectAll(".nodeHouseStark")
            .append('polygon')
            .attr('points', "25,0 0,25 -25,0 0,-25")
            .style("fill", "#ccc")
            .attr('stroke', '#fff')
            .style("stroke-width", "2px");
        
        //Aggiunge un'immagine ai nodi 
        /*node.append("image")
            .attr("xlink:href", "../data/images/GoT_logo.png")
            .attr("x", -25)
            .attr("y", -25)
            .attr("border-radius", "20px")
            .attr("width", 50)
            .attr("height", 50);*/

        // Aggiunge dei riquadri al testo
        /*var rect = node.append("rect")
            .attr("x", 27)
            .attr("y", -25)
            .attr("height", "50px")
            .attr("width", "250px")
            .style("visibility", "hidden");*/

        var node_text = node.append("text")
            .attr("x", 30)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; })
            .style("fill", "white")
            .style("font-size", "25px")
            .style("visibility", "hidden");

        var node_label = node.append("text")
            .attr("x", -7.5)
            .attr("dy", ".35em")
            .text(function(d) { return d.name[0]; })
            .style("fill", "grey")
            .style("font-size", "25px");

        var nodeHouse = d3.selectAll(".node , .nodeBrotherhoodWithoutBanners , .nodeNightsWatch , .nodeFreeFolk , .nodeSandSnakes , .nodeHouseStark")
            .append("text")
            .attr("class", "nodeHouseBirth")
            .attr("x", 45)
            .attr("y", 35)
            .text(function(d) { 
                return d.house_birth; })
            .style("fill", "white")
            .style("font-size", "17px")
            .style("visibility", "hidden");

        function tick() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
        
            node
                .attr("transform", function(d) { 
                    return "translate(" + d.x + "," + d.y + ")"; 
                });
        }

        //Create the legend
        svg.append("rect")
            .attr("x", 5)
            .attr("y", 10)
            .attr("height", "300px")
            .attr("width", "240px")
            .style("fill", "#4b493a")
            .attr('stroke', 'black')
            .attr('stroke-dasharray', '10,5')
            .attr('stroke-linecap', 'butt')
            .attr('stroke-width', '3');

        relations.forEach(element => {
            svg.append("text")
                .text(element.toUpperCase())
                .attr("class", "legend_" + element)
                .attr("x", 25)
                .attr("y", legend_height)
                .style("font-size", "30px")
                .style("border", 0.5)
                .on("mouseover", legend_mouseover)
                .on("mouseout", legend_mouseout);

            legend_height += 40;
        });

        svg.append("rect")
            .attr("x", 5)
            .attr("y", legend_height)
            .attr("height", "230px")
            .attr("width", "240px")
            .style("fill", "#4b493a")
            .attr('stroke', 'black')
            .attr('stroke-dasharray', '10,5')
            .attr('stroke-linecap', 'butt')
            .attr('stroke-width', '3');

        legend_height += 40;

        groups.forEach(element => {

            recttHeight = legend_height-20;
            polygontHeight = legend_height - 10;
            
            if (element == "Brotherhood Without Banners") {
                svg.append('rect')
                    .attr("x", 30)
                    .attr("y", recttHeight)
                    .attr("height", "20px")
                    .attr("width", "20px")
                    .style("fill", "#ccc")
                    .attr('stroke', '#fff')
                    .style("stroke-width", "2px");
            }
            
            if (element =="Night's Watch") {
                svg.append('polygon')    
                    .attr('points', "8,10 -8,10 -13,0 -8,-10 8,-10 13,0") //15,20 -15,20 -25,0 -15,-20 15,-20 25,0
                    .style("fill", "#ccc")
                    .attr('stroke', '#fff')
                    .style("stroke-width", "2px")
                    .attr("transform", "translate(40 " + polygontHeight + ")");
            }
            if (element =="Free Folk") {
                svg.append('polygon')
                    .attr('points', "12,9 0,-12 -12,9")
                    .style("fill", "#ccc")
                    .attr('stroke', '#fff')
                    .style("stroke-width", "2px")
                    .attr("transform", "translate(40 " + polygontHeight + ")");
            }
            if (element =="Sand Snakes") {
                svg.append('rect')
                    .attr("x", 32)
                    .attr("y", recttHeight)
                    .attr("height", "25px")
                    .attr("width", "15px")
                    .style("fill", "#ccc")
                    .attr('stroke', '#fff')
                    .style("stroke-width", "2px");
            }
            if (element =="House Stark") {
                svg.append('polygon')
                    .attr('points', "15,0 0,15 -15,0 0,-15")
                    .style("fill", "#ccc")
                    .attr('stroke', '#fff')
                    .style("stroke-width", "2px")
                    .attr("transform", "translate(40 " + polygontHeight + ")");
            }

            
            svg.append("text")
                .text(function(d) {
                    if (element == "Brotherhood Without Banners") {   //TODO mandare a capo
                        return element;
                    }
                    else return element;
                })
                .attr("class", "legend_" + element)
                .attr("x", 80)
                .attr("y", legend_height)
                .style("font-size", "23px")
                .style("border", 0.5)
                .style("fill", "#ccc")
                .on("mouseover", groupMouseover)
                .on("mouseout", groupMouseout);    

            legend_height += 40;
            
        });
    });

}

function mouseover() {
    var thisNode = d3.select(this);
    var nodeId = thisNode.attr("id").toString().replace("node-", "");
    var linkCssClass = ".link.s" + nodeId + ",.link.t" + nodeId;

    d3.select(this).select("circle, rect, polygon")
        .transition()
        .duration(400)
        .attr("transform", "scale(1.5)")
        .style("stroke",function(d) {
            if (d.status=="Alive") {
                return "green";
            }
            else {
                return "red";
            };
        });
    var text = d3.select(this).select("text")
        .transition()
        .duration(400)
        .attr("x","40")
        .style("visibility", "visible")
        .style("font-size", "35px"); 
    d3.select(this).select(".nodeHouseBirth").transition()
        .delay(400)
        .style("visibility", "visible");
    d3.selectAll(linkCssClass)
        .classed("highlight", true)
        .transition()
        .duration(400)
        .style("opacity", "0.3");   
    d3.selectAll(".node , .nodeBrotherhoodWithoutBanners , .nodeNightsWatch , .nodeFreeFolk , .nodeSandSnakes , .nodeHouseStark")
        .transition()
        .duration(400)
        .style("opacity", "0.3");
    d3.select(this)
        .transition()
        .duration(400)
        .style("opacity", "1");
}
  
function mouseout() {
    d3.select(this).select("circle, rect, polygon").transition()
        .duration(400)
        .attr("transform", "scale(1)")
        .style("stroke","white");
    d3.select(this).select("text").transition()
        .duration(400)
        .attr("x","30")
        .style("visibility", "hidden")
        .attr("fill", "black")
        .style("font-size", "25px");
    d3.select(this).select(".nodeHouseBirth").transition()
        .style("visibility", "hidden");
    d3.selectAll(".link")
        .classed("highlight", false)
        .transition()
        .duration(400)
        .style("opacity", "1");
    d3.selectAll(".node , .nodeBrotherhoodWithoutBanners , .nodeNightsWatch , .nodeFreeFolk , .nodeSandSnakes , .nodeHouseStark").filter(function(d) {return d})
        .transition()
        .duration(400)
        .style("opacity", "1");
}

function legend_mouseover() {
    var relationLink = this.textContent.toLowerCase();
    d3.select(this)
        .style("stroke","black");
    d3.selectAll(".link." + relationLink)
        .classed("highlight", true)
        .transition()
        .duration(400)
        .style("opacity", "0.3");   
}

function legend_mouseout() {
    d3.select(this)
        .style("stroke","");
    d3.selectAll(".link")
        .classed("highlight", false)
        .transition()
        .duration(400)
        .style("opacity", "1");
}

function groupMouseover() {
    var groupNode = this.textContent.replace(/\s+/g, '').replace(/'/, '');
    d3.select(this)
        .style("fill","yellow");
    d3.selectAll(".node , .nodeBrotherhoodWithoutBanners , .nodeNightsWatch , .nodeFreeFolk , .nodeSandSnakes , .nodeHouseStark").transition()
        .duration(400)
        .style("opacity", "0.3");
    d3.selectAll(".node"+groupNode).transition()
        .duration(400)
        .style("opacity", "1")
        .select("circle, rect, polygon").transition()
        .duration(400)
        .attr("transform", "scale(1.5)")
        .style("stroke","black");
}

function groupMouseout() {
    var groupNode = this.textContent.replace(/\s+/g, '').replace(/'/, '');
    d3.select(this)
        .style("fill","#ccc");
    d3.selectAll(".node , .nodeBrotherhoodWithoutBanners , .nodeNightsWatch , .nodeFreeFolk , .nodeSandSnakes , .nodeHouseStark").transition()
        .duration(400)
        .style("opacity", "1");
    d3.selectAll(".node"+groupNode)
        .select("circle, rect, polygon").transition()
        .duration(400)
        .attr("transform", "scale(1)")
        .style("stroke","white");
}

// Deletes duplicates in an array
function deleteDuplicates(array) {
    return array.filter(function(item, pos) {
        return array.indexOf(item) == pos && item != undefined;
    })
}

//Applicando il filtro succedono i macelli
function filterByGroup() {
    nodes2 = nodes.filter(node => {
        return node.group == "Brotherhood Without Banners";
    });

    links2 = links.filter(link => {
        //return contains(link, nodes2);
        s = link.source.id;
        t = link.target.id;
        return (nodes[s].group == "Brotherhood Without Banners" && nodes[t].group == "Brotherhood Without Banners");
    });

    console.log("ciao");
}

// Verifies if link's source and target are contained in the array of nodes 
//VAFFANCULO FUNZIONE DI MERDA APPENA AVRò LA CERTEZZA CHE NON MI SERVI TI CANCELLO
/*function contains(link, nodes) {
    var test = false;

    nodes.forEach(node1 => {
        if (link.source == node1.id)  {
            nodes.forEach(node2 => {
                
                if (link.target.id == node2.id)  {
                    test = true;
                }  
            })
        }
    });

    return test;
}*/

gotVis();