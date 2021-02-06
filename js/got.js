var links = [];
var nodes = [];
var s, t = null;
var legend_height = 40;
var statusSelector = null;
var status = null;
var running = false;
var svgSize = null;

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
        var relations = deleteDuplicates(notUniqueRelations);   

        
        // Array of characters' groups
        var notUniqueGroups = [];
        nodes.forEach(elem => {
            notUniqueGroups.push(elem.group);
        })
        var groups = deleteDuplicates(notUniqueGroups);
        
        // Create the graph
        var svg = d3.select("body").append("svg")
            .attr("id", "graph")
        var defs = svg.append('svg:defs');
        nodes.forEach(element => {
            defs.append('svg:pattern')
                .attr('id', "image-" + element.id)
                .attr('width', 1)
                .attr('height', 1)
                .attr("patternContentUnits", "objectBoundingBox")
                .append('svg:image')
                .attr('xlink:href', "../data/images/"+ element.id + ".jpg")
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', 1)
                .attr('height', 1)
                .attr("preserveAspectRatio","xMinYMin slice");
        });

        svgSize = document.getElementById('graph').getBoundingClientRect();

        // Force layout
        var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([svgSize.width, svgSize.height])
        .linkDistance(130)
        .charge(-375)
        .on("tick", tick)
        .start();

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
            .on("mouseover",nodeMouseover)
            .on("mouseout", nodeMouseout)
            .call(force.drag);
        
        svg.selectAll(".node").append("circle")
            .attr("class", function(d) {
                return d.status;
            })
            .attr("r", 25)
            .style("fill",function(d) {
                return "url(#image-" + d.id +")";
            })
            .style("stroke", "#fff")
            .style("stroke-width", "1px");

        //Node shapes for different groups
        svg.selectAll(".nodeFreeFolk")
            .append('polygon')
            .attr("class", function(d) {
                return d.status;
            })
            .attr('points', "-30-25 0,30 30,-25")
            .style("fill",function(d) {
                return "url(#image-" + d.id +")";
            })
            .attr('stroke', '#fff')
            .style("stroke-width", "1px");

        svg.selectAll(".nodeBrotherhoodWithoutBanners")
            .append('rect')
            .attr("class", function(d) {
                return d.status;
            })
            .attr("x", -20)
            .attr("y", -20)
            .attr("height", "55px")
            .attr("width", "55px")
            .style("fill",function(d) {
                return "url(#image-" + d.id +")";
            })
            .attr('stroke', '#fff')
            .style("stroke-width", "1px");

        svg.selectAll(".nodeNightsWatch")
            .append('polygon')
            .attr("class", function(d) {
                return d.status;
            })
            .attr('points', "15,30 -15,30 -27,0 -15,-30 15,-30 27,0")
            .style("fill",function(d) {
                return "url(#image-" + d.id +")";
            })
            .attr('stroke', '#fff')
            .style("stroke-width", "1px");

        svg.selectAll(".nodeSandSnakes")
            .append('rect')
            .attr("class", function(d) {
                return d.status;
            })
            .attr("x", -20)
            .attr("y", -30)
            .attr("height", "60px")
            .attr("width", "40px")
            .style("fill",function(d) {
                return "url(#image-" + d.id +")";
            })
            .attr('stroke', '#fff')
            .style("stroke-width", "1px");
            
        svg.selectAll(".nodeHouseStark")
            .append('polygon')
            .attr("class", function(d) {
                return d.status;
            })
            .attr('points', "33,0 0,33 -33,0 0,-33")
            .style("fill",function(d) {
                return "url(#image-" + d.id +")";
            })
            .attr('stroke', '#fff')
            .style("stroke-width", "1px");

        node.append("text")
            .attr("x", 30)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; })
            .style("fill", "white")
            .style("font-size", "25px")
            .style("visibility", "hidden");

        d3.selectAll(".node , .nodeBrotherhoodWithoutBanners , .nodeNightsWatch , .nodeFreeFolk , .nodeSandSnakes , .nodeHouseStark")
            .append("text")
            .attr("class", "nodeHouseBirth")
            .attr("x", 85)
            .attr("y", 35)
            .text(function(d) { if(d.house_birth != undefined) {
                return "Birth: " + d.house_birth; }})
            .style("fill", "white")
            .style("font-size", "17px")
            .style("visibility", "hidden");

        d3.selectAll(".node , .nodeBrotherhoodWithoutBanners , .nodeNightsWatch , .nodeFreeFolk , .nodeSandSnakes , .nodeHouseStark")
            .append("text")
            .attr("class", "nodeHouseMarriage")
            .attr("x", 85)
            .attr("y", function(d) {
                if(d.house_birth == undefined)
                    return 35;
                else return 50
            })
            .text(function(d) { if (d.house_marriage != undefined){
                return "Marriage: " + d.house_marriage; }})
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
            .attr("height", "340px")
            .attr("width", "240px")
            .style("fill", "#4b493a")
            .attr('stroke', 'black')
            .attr('stroke-dasharray', '10,5')
            .attr('stroke-linecap', 'butt')
            .attr('stroke-width', '3');
        
        svg.append("text")
            .text("Relations")
            .attr("x", 72.5)
            .attr("y", legend_height)
            .style("font-size", "25px")
            .style("border", 0.5)
            .style("fill", "white");
    
        svg.append('line')
            .style("stroke", "white")
            .style("stroke-width", 1)
            .attr("x1", 25)
            .attr("y1", legend_height + 5)
            .attr("x2", 225)
            .attr("y2", legend_height +5)

        legend_height += 35;

        relations.forEach(element => {
            svg.append("text")
                .text(element.toUpperCase())
                .attr("class", "legend_" + element)
                .attr("x", 25)
                .attr("y", legend_height)
                .style("font-size", "25px")
                .style("border", 0.5)
                .on("mouseover", relationMouseover)
                .on("mouseout", relationMouseout);

            legend_height += 30
        });

        svg.append("rect")
            .attr("x", 5)
            .attr("y", legend_height -10)
            .attr("height", "290px")
            .attr("width", "240px")
            .style("fill", "#4b493a")
            .attr('stroke', 'black')
            .attr('stroke-dasharray', '10,5')
            .attr('stroke-linecap', 'butt')
            .attr('stroke-width', '3');

        legend_height += 20;

        svg.append("text")
            .text("Groups")
            .attr("x", 85)
            .attr("y", legend_height)
            .style("font-size", "25px")
            .style("border", 0.5)
            .style("fill", "white");

        svg.append('line')
            .style("stroke", "white")
            .style("stroke-width", 1)
            .attr("x1", 25)
            .attr("y1", legend_height + 5)
            .attr("x2", 225)
            .attr("y2", legend_height +5)


        legend_height += 30;

        groups.forEach(element => {

            recttHeight = legend_height-20;
            polygontHeight = legend_height - 10;

            var originalElement = element;
            element = element.replace(/\s+/g, '').replace(/'/, '');
            
            if (element == "BrotherhoodWithoutBanners") {
                svg.append('rect')
                    .attr("x", 30)
                    .attr("y", recttHeight + 10)
                    .attr("height", "25px")
                    .attr("width", "25px")
                    .style("fill", "#ccc")
                    .attr('stroke', '#fff')
                    .style("stroke-width", "2px");
            }
            
            if (element =="NightsWatch") {
                svg.append('polygon')    
                    .attr('points', "8,13 -8,13 -13,0 -8,-13 8,-13 13,0")
                    .style("fill", "#ccc")
                    .attr('stroke', '#fff')
                    .style("stroke-width", "2px")
                    .attr("transform", "translate(42.5 " + polygontHeight + ")");
            }
            if (element =="FreeFolk") {
                svg.append('polygon')
                    .attr('points', "-15,-13 0,15 15,-13")
                    .style("fill", "#ccc")
                    .attr('stroke', '#fff')
                    .style("stroke-width", "2px")
                    .attr("transform", "translate(42.5 " + polygontHeight + ")");
            }
            if (element =="SandSnakes") {
                svg.append('rect')
                    .attr("x", 35)
                    .attr("y", recttHeight)
                    .attr("height", "25px")
                    .attr("width", "15px")
                    .style("fill", "#ccc")
                    .attr('stroke', '#fff')
                    .style("stroke-width", "2px");
            }
            if (element =="HouseStark") {
                svg.append('polygon')
                    .attr('points', "15,0 0,15 -15,0 0,-15")
                    .style("fill", "#ccc")
                    .attr('stroke', '#fff')
                    .style("stroke-width", "2px")
                    .attr("transform", "translate(42.5 " + polygontHeight + ")");
            }

            if (element == "BrotherhoodWithoutBanners") {
                svg.append("text")
                    .text("Brotherhood")
                    .attr("class", "legend_" + element)
                    .attr("x", 80)
                    .attr("y", legend_height)
                    .style("font-size", "23px")
                    .style("border", 0.5)
                    .style("fill", "#ccc")
                    .on("mouseover", groupMouseover)
                    .on("mouseout", groupMouseout);  
                
                legend_height += 20;

                svg.append("text")
                    .text("Without Banners")
                    .attr("class", "legend_" + element)
                    .attr("x", 80)
                    .attr("y", legend_height)
                    .style("font-size", "23px")
                    .style("border", 0.5)
                    .style("fill", "#ccc")
                    .on("mouseover", groupMouseover)
                    .on("mouseout", groupMouseout);  
                
                legend_height += 40;
            }
            else {
                svg.append("text")
                .text(originalElement)
                .attr("class", "legend_" + element)
                .attr("x", 80)
                .attr("y", legend_height)
                .style("font-size", "23px")
                .style("border", 0.5)
                .style("fill", "#ccc")
                .on("mouseover", groupMouseover)
                .on("mouseout", groupMouseout);    

            legend_height += 40;
            } 
        });

        svg.append("rect")
            .attr("x", 5)
            .attr("y", legend_height -15)
            .attr("height", "170px")
            .attr("width", "240px")
            .style("fill", "#4b493a")
            .attr('stroke', 'black')
            .attr('stroke-dasharray', '10,5')
            .attr('stroke-linecap', 'butt')
            .attr('stroke-width', '3');

        legend_height += 20;

        svg.append("text")
            .text("Status")
            .attr("x", 90)
            .attr("y", legend_height)
            .style("font-size", "25px")
            .style("border", 0.5)
            .style("fill", "white");

        svg.append('line')
            .style("stroke", "white")
            .style("stroke-width", 1)
            .attr("x1", 25)
            .attr("y1", legend_height + 5)
            .attr("x2", 225)
            .attr("y2", legend_height +5)

        legend_height += 27;

        svg.append("circle")
            .attr("r", 15)
            .style("fill", "#ccc")
            .style("stroke", "red")
            .style("stroke-width", "2px")
            .attr("transform", "translate(40 " + legend_height + ")");

        svg.append("text")
            .text("Deceased")
            .attr("x", 80)
            .attr("y", legend_height + 10)
            .style("font-size", "23px")
            .style("border", 0.5)
            .style("fill", "#ccc")
            .on("mouseover", statusMouseover)
            .on("mouseout", statusMouseout);    

        legend_height += 40;

        svg.append("circle")
            .attr("r", 15)
            .style("fill", "#ccc")
            .style("stroke", "green")
            .style("stroke-width", "2px")
            .attr("transform", "translate(40 " + legend_height + ")");

        svg.append("text")
            .text("Alive")
            .attr("x", 80)
            .attr("y", legend_height + 10)
            .style("font-size", "23px")
            .style("border", 0.5)
            .style("fill", "#ccc")
            .on("mouseover", statusMouseover)
            .on("mouseout", statusMouseout);
    
        legend_height += 40;

        svg.append("circle")
            .attr("r", 15)
            .style("fill", "#ccc")
            .style("stroke", "grey")
            .style("stroke-width", "2px")
            .attr("transform", "translate(40 " + legend_height + ")");

        svg.append("text")
            .text("Uncertain")
            .attr("x", 80)
            .attr("y", legend_height + 10)
            .style("font-size", "23px")
            .style("border", 0.5)
            .style("fill", "#ccc")
            .on("mouseover", statusMouseover)
            .on("mouseout", statusMouseout);    

    });
}

function nodeMouseover() {
    var thisNode = d3.select(this);
    var nodeId = thisNode.attr("id").toString().replace("node-", "");
    var linkCssClass = ".link.s" + nodeId + ",.link.t" + nodeId;

    d3.select(this).select("circle, rect, polygon")
        .transition()
        .duration(400)
        .attr("transform", "scale(2)")
        .style("stroke",function(d) {
            if (d.status=="Alive") {
                return "green";
            }
            if(d.status == "Deceased") {
                return "red";
            }
            else return "grey";
        })
        .style("stroke-width", "2px");
    d3.select(this).select("text")
        .transition()
        .duration(400)
        .attr("x","80")
        .style("visibility", "visible")
        .style("font-size", "40px"); 
    d3.select(this).select(".nodeHouseBirth").transition()
        .delay(400)
        .style("visibility", "visible");
    d3.select(this).select(".nodeHouseMarriage").transition()
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
  
function nodeMouseout() {
    d3.select(this).select("circle, rect, polygon").transition()
        .duration(400)
        .attr("transform", "scale(1)")
        .style("stroke","white")
        .style("stroke-width", "1px");
    d3.select(this).select("text").transition()
        .duration(400)
        .attr("x","30")
        .style("visibility", "hidden")
        .attr("fill", "black")
        .style("font-size", "25px");
    d3.select(this).select(".nodeHouseBirth").transition()
        .style("visibility", "hidden");
    d3.select(this).select(".nodeHouseMarriage").transition()
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

function relationMouseover() {
    var relationLink = this.textContent.toLowerCase();
    d3.select(this)
        .style("stroke","black");
    d3.selectAll(".link." + relationLink)
        .classed("highlight", true);
    d3.selectAll(".node , .nodeBrotherhoodWithoutBanners , .nodeNightsWatch , .nodeFreeFolk , .nodeSandSnakes , .nodeHouseStark")
        .transition()
        .duration(400)
        .style("opacity", "0.3");  
}

function relationMouseout() {
    d3.select(this)
        .style("stroke","");
    d3.selectAll(".link")
        .classed("highlight", false);
    d3.selectAll(".node , .nodeBrotherhoodWithoutBanners , .nodeNightsWatch , .nodeFreeFolk , .nodeSandSnakes , .nodeHouseStark")
        .transition()
        .duration(400)
        .style("opacity", "1"); 
}

function groupMouseover() {
    var groupNode = this.textContent.replace(/\s+/g, '').replace(/'/, '');
    if (groupNode == "Brotherhood" | groupNode == "WithoutBanners") {
        groupNode = "BrotherhoodWithoutBanners";

        d3.selectAll(".legend_BrotherhoodWithoutBanners")
            .style("fill","yellow");
    }
 
    d3.select(this)
        .style("fill","yellow");
    d3.selectAll(".node , .nodeBrotherhoodWithoutBanners , .nodeNightsWatch , .nodeFreeFolk , .nodeSandSnakes , .nodeHouseStark")
        .transition()
        .duration(400)
        .style("opacity", "0.3");
    d3.selectAll(".node"+groupNode).transition()
        .duration(0)
        .style("opacity", "1")
        .select("circle, rect, polygon").transition()
        .duration(400)
        .attr("transform", "scale(2)")
        .style("stroke", function(d){
            if (d.status=="Alive") return "green";
            if (d.status=="Deceased") return "red";
            else return "grey";
        }
        )
        .style("stroke-width", "2px");
}

function groupMouseout() {
    var groupNode = this.textContent.replace(/\s+/g, '').replace(/'/, '');
    if (groupNode == "Brotherhood" || groupNode == "WithoutBanners") {
        groupNode = "BrotherhoodWithoutBanners";

        d3.selectAll(".legend_BrotherhoodWithoutBanners")
            .style("fill","#ccc");
    }
    d3.select(this)
        .style("fill","#ccc");
    d3.selectAll(".node , .nodeBrotherhoodWithoutBanners , .nodeNightsWatch , .nodeFreeFolk , .nodeSandSnakes , .nodeHouseStark").transition()
        .duration(400)
        .style("opacity", "1");
    d3.selectAll(".node"+groupNode)
        .select("circle, rect, polygon").transition()
        .duration(400)
        .attr("transform", "scale(1)")
        .style("stroke","white")
        .style("stroke-width", "1px");
}

function statusMouseover() {

    status = this.textContent;
    if (status == "Alive") statusSelector = ".Deceased, .Uncertain";
    else if (status == "Deceased") statusSelector =".Alive, .Uncertain";
    else statusSelector = ".Alive, .Deceased";

    d3.select(this)
        .style("fill","yellow");

    d3.selectAll(statusSelector)
        .transition()
        .delay(function() {
            if (running) {
                return 400;
            } else return 0;
        }) 
        .duration(400)
        .style("opacity", "0.3")
        .attr("transform", "scale(1)")
        .style("stroke", "#fff");
    
    d3.selectAll("." + status)
        .transition()
        .delay(function() {
            if (running) {
                return 400;
            } else return 0;
        })
        .duration(400)
        .style("opacity", "1")
        .style("stroke", function()  {
            if (status=="Alive") return "green";
            if (status=="Deceased") return "red";
            else return "grey";
        })
        .attr("transform", "scale(1.5)")
        .style("stroke-width", "2px");
}

function statusMouseout() {

    status = this.textContent;
    if (status == "Alive") statusSelector = ".Deceased, .Uncertain";
    else if (status == "Deceased") statusSelector =".Alive, .Uncertain";
    else statusSelector = ".Alive, .Deceased";

    d3.select(this)
        .style("fill","#ccc");

    d3.selectAll(".Alive, .Deceased, .Uncertain")
        .transition()
        .duration(400)
        .attr("transform", "scale(1)")
        .style("stroke", "#fff")
        .style("opacity", "1")
        .each("start", function() {
            running = true;
        }).each("end", function() {
            running = false;
        })
        .style("stroke-width", "1px");
}

// Deletes duplicates in an array
function deleteDuplicates(array) {
    return array.filter(function(item, pos) {
        return array.indexOf(item) == pos && item != undefined;
    })
}

gotVis();