const scroll = 'scroll';
const mouseMove = 'mousemove';
const click = 'click';
const touchMove = 'touchmove';
const touchStart = 'touchstart';
const onKeyPress = 'onkeypress';

const sensitivity = 1.0/100;

window.addEventListener(scroll, function()
{
    WebGlClassInst.scrollY = window.scrollY;
});

window.addEventListener(mouseMove, AdjustMousePosition);
window.addEventListener(touchMove, AdjustMousePosition);
window.addEventListener(touchStart, MouseClicked);
window.addEventListener(click, MouseClicked);

function AdjustMousePosition(e)
{
    WebGlClassInst.mouseX = e.pageX * sensitivity;
    WebGlClassInst.mouseY = e.pageY * sensitivity;
}

function MouseClicked(e)
{
    WebGlClassInst.StepSubdivisions();
}