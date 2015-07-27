casper.notebook_test ->
  cells = {}

  @on "error", (msg, backtrace) ->
    console.log msg, backtrace

  @then ->
    @execute_cell @append_cell """
      from IPython.display import display
      from ipythond3sankey.widgets import D3Sankey
      d3sankey = D3Sankey(value="2000-01-01")""",
      "code"

  @wait_for_idle()

  @then ->
    @execute_cell @append_cell "display(d3sankey)", "code"

  @wait_for_idle()

  @then ->
    @test.assertEval(
      -> $(".widget-subarea input").val() == "2000-01-01"
      "...initialized with value"
    )

  @wait_for_idle()

  @then ->
    @fillSelectors ".D3SankeyView", "input": "1999-09-09"

  @then ->
    @execute_cell cells.val = @append_cell "d3sankey.value",
      "code"

  @wait_for_idle()

  @then ->
    @test.assertMatch @get_output_cell(cells.val).data["text/plain"],
      /1999-09-09/,
      "...changes backend value"

  @then ->
    @exit()
