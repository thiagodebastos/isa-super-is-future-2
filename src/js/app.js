import TimelineLite from "gsap/TimelineLite";
import { TweenLite } from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import ScrollMagic from "scrollmagic";

//
// ─── SMOOTH SCROLLING ───────────────────────────────────────────────────────────
//

function Scroller(scrollElement, scrollTarget) {
  const TL = new TimelineLite({});
  scrollElement.addEventListener("click", evt => {
    evt.preventDefault();
    TL.to(window, 0.5, { scrollTo: scrollTarget });
  });
}

function animateGraph(graphID) {
  const TL = new TimelineLite();

  const rects = nodeListToArray(`${graphID} rect.fill`);
  rects.map(rect => {
    return TL.to(rect, 0.1, { fill: "#005689" });
  });
}

//
// ─── NUMBER INCREASE ANIMATION ──────────────────────────────────────────────────
//

function Counter() {
  this.value = 0;
}
// querySelectorAll returns a NodeList, not an array.
// spread over the nodelist into a new array, so we can call map()
function nodeListToArray(nodeList) {
  return [...document.querySelectorAll(nodeList)];
}

function animateNumbers(element, val) {
  /*  we need to keep track of each animation by generating a new counter for
        each, we save ourselves from declaring variables for each.*/
  let counter = new Counter();
  const TL = new TimelineLite();
  TL.to(
    counter,
    1,
    {
      value: val,
      roundProps: "value",
      onUpdate: () => updateHandler(element, counter.value),
      ease: Power1.easeIn
    },
    0
  );
}

function updateHandler(el, counter) {
  el.innerHTML = Math.floor(counter);
}

function animateNumberArray(target, stats) {
  target.map((el, i) => {
    animateNumbers(target[i], stats[i], i);
  });
}

// Tooltip highlighting
// let highlighted = false;
// const chart1Primary = document.querySelector(".donut-chart-2 .st2");
// const chart1Tooltips = document.querySelector(".tile--left .tooltip");

// function highlight(target) {
//   console.log(target);
//   target.style.color = highlighted ? "red" : "rebeccapurple";
// }

// chart1Primary.addEventListener("mouseover", () => highlight(chart1Tooltips));
// chart1Primary.addEventListener("mouseout", () => (highlighted = false));

//
// ─── SCROLLMAGIC ────────────────────────────────────────────────────────────────
//

function scrollMagicMisc() {
  const controller = new ScrollMagic.Controller();
  const scene = new ScrollMagic.Scene({
    triggerElement: ".pullquote",
    duration: 250,
    reverse: false
  })
    .on("start", () => TweenMax.to(".pullquote", 1, { autoAlpha: 1 }))
    .addTo(controller);
}

function scrollMagicGraphs(externalAnimation, target) {
  const controller = new ScrollMagic.Controller();
  const scene = new ScrollMagic.Scene({
    triggerElement: "#stats_01",
    duration: 300,
    reverse: false
  })
    .on("start", () => externalAnimation(target))
    .addTo(controller);
}

function scrollMagicAnimations(externalAnimation) {
  let targets, controller;

  function animateEverything(thingsToAnimate, externalAnimation) {
    controller = new ScrollMagic.Controller();
    thingsToAnimate.map(target => {
      new ScrollMagic.Scene({
        triggerElement: target.triggerNode,
        reverse: false
      })
        .on("start", function() {
          return externalAnimation(target.animationTarget, target.stats);
        })
        .addTo(controller);
    });
  }

  function init() {
    targets = [
      {
        triggerNode: "#stats_00",
        animationTarget: nodeListToArray("#stats_00 .stat-number"),
        stats: [70]
      },
      {
        triggerNode: "#stats_01",
        animationTarget: nodeListToArray("#stats_01 .stat-number"),
        stats: [12]
      },
      {
        triggerNode: "#stats_01",
        animationTarget: nodeListToArray("#stats_02 .stat-number"),
        stats: [10]
      },
      {
        triggerNode: "#stats_03",
        animationTarget: nodeListToArray("#stats_03 .stat-number"),
        stats: [55, 66, 58, 61]
      }
    ];

    animateEverything(targets, animateNumberArray);
  }

  return {
    init: init()
  };
}

//
// ─── APP ────────────────────────────────────────────────────────────────────────
//

function App() {
  scrollDownButton = document.querySelector(".scroll-down");
  Scroller(scrollDownButton, "#content");
  scrollMagicAnimations(animateNumberArray).init;
  scrollMagicGraphs(animateGraph, "#bar-graph-1");
  scrollMagicGraphs(animateGraph, "#bar-graph-2");
  // scrollMagicMisc();
}

let scrollDownButton;

App();
