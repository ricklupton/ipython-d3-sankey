// the immediately-called closure and 'use strict' helps ensure hygiene
;(function(define) {
'use strict';
 /**
  * The browser-side counterpart to D3Sankey
  *
  * @author Rick Lupton
  * @copyright Rick Lupton 2015
  * @version 0.1.0
  * @license MIT
  */
define([
  // libraries
  'jquery',
  'underscore',

  // ipython API
  'widgets/js/widget',

  // local imports
  './utils',
  './d3.min',
  './sankey',
], function($, _, widget, utils, d3) {
  var D3SankeyView = widget.DOMWidgetView.extend({
    // namespace your CSS so that you don't break other people's stuff
    className: 'ipythond3sankey D3SankeyView',

    loadCss: utils.loadCss,

    // Initialize DOM, etc. called once per view creation,
    // i.e. `display(widget)`
    render: function() {

      // add a stylesheet, if defined in `_view_style`
      this.loadCss();

      // setup
      // XXX margins, width and height not updated
      var margin = {top:    this.model.get('margin_top'),
                    right:  this.model.get('margin_right'),
                    bottom: this.model.get('margin_bottom'),
                    left:   this.model.get('margin_left')},
          width = this.model.get('width') - margin.left - margin.right,
          height = this.model.get('height') - margin.top - margin.bottom;

      this.width = width;
      this.height = height;

      var formatNumber = d3.format(",.0f"),
          unit = this.model.get('unit');

      this.format = function(d) { return formatNumber(d) + " " + unit; };
      this.color = d3.scale.category20();

      this.svg = d3.select(this.$el[0]).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

      this.svg.append("g").classed("links", true);
      this.svg.append("g").classed("nodes", true);

      this.sankey = d3.sankey()
          .nodeWidth(15)
          .nodePadding(10)
          .size([width, height]);

      this.path = this.sankey.link();

      // call an update once the node has been added to the DOM...
      this.update();

      return this;
    }, // /render

    // Do things that are updated every time `this.model` is changed...
    // from the front-end or backend.
    update: function(options) {

      var that = this;

      var nodes = this.model.get('nodes'),
          links = this.model.get('links');

      if (!nodes || !links) {
        return;
      }

      this.sankey
        .nodes(nodes)
        .links(links)
        .layout(32);

      var link = this.svg.select(".links").selectAll(".link")
          .data(links);

      link.enter()
        .append("path")
        .attr("class", "link")
        .append("title");

      link
        .attr("d", this.path)
        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
        .sort(function(a, b) { return b.dy - a.dy; });

      link.select('title')
        .text(function(d) { return d.source.name + " → " + d.target.name +
                            "\n" + that.format(d.value); });

      link.exit().remove();

      var node = this.svg.select(".nodes").selectAll(".node")
          .data(nodes);

      var newNode = node.enter()
        .append("g")
        .attr("class", "node")
        .call(d3.behavior.drag()
              .origin(function(d) { return d; })
              .on("dragstart", function() {
                this.parentNode.appendChild(this); })
              .on("drag", dragmove));

      newNode.append("rect");
      newNode.append("text");

      node
        .attr("transform",
              function(d) { return "translate(" + d.x + "," + d.y + ")"; });

      node.select("rect")
        .attr("height", function(d) { return d.dy; })
        .attr("width", this.sankey.nodeWidth())
        .style("fill", function(d) {
          return d.color = that.color(d.name.replace(/ .*/, "")); })
        .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
        .append("title")
        .text(function(d) { return d.name + "\n" + that.format(d.value); });

      node.select("text")
        .attr("x", -6)
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) { return d.name; })
        .filter(function(d) { return d.x < that.width / 2; })
        .attr("x", 6 + this.sankey.nodeWidth())
        .attr("text-anchor", "start");

      node.exit().remove()

      function dragmove(d) {
        d3.select(this)
          .attr("transform", "translate(" + d.x + "," +
                (d.y = Math.max(0, Math.min(that.height - d.dy, d3.event.y))) +
                ")");
        that.sankey.relayout();
        link.attr("d", that.path);
      }

      // call __super__.update to handle housekeeping
      return D3SankeyView.__super__.update.apply(this);
    }, // /update


    // Tell Backbone to listen to events (none for now)
    events: {
    },

  }); // /extend

  // The requirejs namespace.
  return {
    D3SankeyView: D3SankeyView
  };
});
}).call(this, define);
