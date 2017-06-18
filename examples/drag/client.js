// dop
var server = dop.connect()
var circleServer = dop.register({});
server.subscribe().into(circleServer)
var observer = dop.createObserver(function() {
    // We shouldn't update position from others if we are alredy moving it localy
    if (!circle.mover) { 
        circle.el.style.left = circleServer.x + 'px'
        circle.el.style.top = circleServer.y + 'px'
    }
})
observer.observe(circleServer)
// end dop



var circle = onDrag('circle', function(x,y){
    this.style.left = x + 'px'
    this.style.top = y + 'px'
    // sending to server
    circleServer.move(x, y) 
})
var square = onDrag('square', function(x,y){
    this.style.left = x + 'px'
    this.style.top = y + 'px'
})


function onDrag(elementId, callback) {
    var shape ={}
    shape.el = document.getElementById(elementId)
    shape.mover = false
    shape.first = true
    shape.el.onmousedown = function() {
        shape.mover = true
    }
    shape.el.onmouseup = function() {
        shape.mover = false
        shape.first = true
    }
    shape.el.onmousemove = function(e) {
        if (shape.mover) {
            if (shape.first) {
                shape.x = e.offsetX
                shape.y = e.offsetY
                shape.first = false
            }
            shape.posx = e.pageX - shape.x
            shape.posy = e.pageY - shape.y
            callback.call(this, shape.posx, shape.posy)
        }
    }

    return shape
}