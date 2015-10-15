define([ "chroma-js", "map", "sidebar", "tabs", "container", "meshstats",
         "legend", "linklist", "nodelist", "simplenodelist", "infobox/main",
         "proportions", "forcegraph", "title", "about" ],
function (chroma, Map, Sidebar, Tabs, Container, Meshstats, Legend, Linklist,
          Nodelist, SimpleNodelist, Infobox, Proportions, ForceGraph,
          Title, About) {
  return function (config, router) {
    var self = this
    var dataTargets = []
    var latestData
    var content
    var contentDiv

    var linkScale = chroma.scale(chroma.interpolate.bezier(["#FF0000", "#FFFF00", "#00FF00"])).domain([0.2, 1])
    var sidebar

    var buttons = document.createElement("div")
    buttons.classList.add("buttons")

    function dataTargetRemove(d) {
      dataTargets = dataTargets.filter( function (e) { return d !== e })
    }

    function removeContent() {
      if (!content)
        return

      router.removeTarget(content)
      dataTargetRemove(content)
      content.destroy()

      content = null
    }

    function addContent(K) {
      removeContent()

      content = new K(config, linkScale, sidebar.getWidth, router, buttons)
      content.render(contentDiv)

      if (latestData)
        content.setData(latestData)

      dataTargets.push(content)
      router.addTarget(content)
    }

    function mkView(K) {
      return function () {
        addContent(K)
      }
    }

    contentDiv = document.createElement("div")
    contentDiv.classList.add("content")
    document.body.appendChild(contentDiv)

    sidebar = new Sidebar(document.body)

    contentDiv.appendChild(buttons)

    var buttonToggle = document.createElement("button")
    buttonToggle.textContent = ""
    buttonToggle.onclick = function () {
      if (content.constructor === Map)
        router.view("g")
      else
        router.view("m")
    }

    buttons.appendChild(buttonToggle)

    var title = new Title(config)

    var header = new Container("header")
    var infobox = new Infobox(config, sidebar, router)
    var tabs = new Tabs()
    var overview = new Container()
    var meshstats = new Meshstats(config)
    var legend = new Legend()
    var newnodeslist = new SimpleNodelist("new", "firstseen", router, "Neue Knoten")
    var lostnodeslist = new SimpleNodelist("lost", "lastseen", router, "Verschwundene Knoten")
    var nodelist = new Nodelist(router)
    var linklist = new Linklist(linkScale, router)
    var statistics = new Proportions(config)
    var about = new About()

    dataTargets.push(meshstats)
    dataTargets.push(newnodeslist)
    dataTargets.push(lostnodeslist)
    dataTargets.push(nodelist)
    dataTargets.push(linklist)
    dataTargets.push(statistics)

    sidebar.add(header)
    header.add(meshstats)
    header.add(legend)

    overview.add(newnodeslist)
    overview.add(lostnodeslist)

    sidebar.add(tabs)
    tabs.add("Aktuelles", overview)
    tabs.add("Knoten", nodelist)
    tabs.add("Verbindungen", linklist)
    tabs.add("Statistiken", statistics)
    tabs.add("Über", about)

    router.addTarget(title)
    router.addTarget(infobox)

    router.addView("m", mkView(Map))
    router.addView("g", mkView(ForceGraph))

    router.view("m")

    self.setData = function (data) {
      latestData = data

      dataTargets.forEach(function (d) {
        d.setData(data)
      })
    }

    return self
  }
})
