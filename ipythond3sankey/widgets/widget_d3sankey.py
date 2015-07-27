# -*- coding: utf-8 -*-

# Import widgets, provisioners and traitlets
from IPython.html import widgets
from IPython.utils import traitlets


class D3Sankey(widgets.DOMWidget):
    # the name of the requirejs module (no .js!)
    _view_module = traitlets.Unicode(
        'nbextensions/ipythond3sankey/js/widget_d3sankey',
        sync=True)

    # the name of the Backbone.View subclass to be used
    _view_name = traitlets.Unicode(
        'D3SankeyView',
        sync=True
    )

    # the name of the CSS file to load with this widget
    _view_style = traitlets.Unicode(
        'nbextensions/ipythond3sankey/css/widget_d3sankey',
        sync=True
    )

    # the actual value: lists of nodes and links
    nodes = traitlets.List(sync=True)
    links = traitlets.List(sync=True)

    # margins & size
    margin_top = traitlets.Float(1, sync=True)
    margin_right = traitlets.Float(1, sync=True)
    margin_bottom = traitlets.Float(6, sync=True)
    margin_left = traitlets.Float(1, sync=True)
    width = traitlets.Float(960, sync=True)
    height = traitlets.Float(500, sync=True)

    unit = traitlets.Unicode('', sync=True)
