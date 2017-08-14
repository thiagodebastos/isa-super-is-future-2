import TimelineLite from "gsap/TimelineLite";
import {
  TweenLite
} from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import ScrollMagic from "scrollmagic";

//
// ─── SET THE STAGE ──────────────────────────────────────────────────────────────
//

const TL = new TimelineMax();

TL.set(".bar-graph-3 rect, .bar-graph-2--bar", {
  autoAlpha: 0,
});

//
// ─── SMOOTH SCROLLING ───────────────────────────────────────────────────────────
//

function Scroller(scrollElement, scrollTarget) {
  const TL = new TimelineLite({});
  scrollElement.addEventListener("click", evt => {
    evt.preventDefault();
    TL.to(window, 0.5, {
      scrollTo: scrollTarget
    });
  });
}

function animateBarChart(graphID) {
  const TL = new TimelineLite();
  const rects = nodeListToArray(`${graphID} rect.fill`);
  rects.map(rect => {
    return TL.to(rect, 0.2, {
      fill: "#005689"
    });
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
    1, {
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

//
// ─── SCROLLMAGIC ────────────────────────────────────────────────────────────────
//

function scrollMagicCustomGraph_01() {
  const controller = new ScrollMagic.Controller();
  const scene = new ScrollMagic.Scene({
      triggerElement: ".bar-graph-1",
      duration: 250,
      reverse: false
    })
    .on("start", () =>
      TL.set(".bar-graph-1 rect, .bar-graph-1 line", {
        autoAlpha: 1
      })
      .staggerTo(
        ".bar-graph-1 rect",
        0.5, {
          autoAlpha: 1,
          ease: Power1.easeIn
        },
        0.1
      )
      .to(".bar-graph-1 text", 0.25, {
        autoAlpha: 1
      })
      .from(".bar-graph-1 line", 0.25, {
        scale: 0,
        transformOrigin: "center center"
      })
    )
    .addTo(controller);
}


function scrollMagicCustomGraph_02() {
  const controller = new ScrollMagic.Controller();
  const scene = new ScrollMagic.Scene({
      triggerElement: ".bar-graph-2",
      duration: 250,
      reverse: false
    })
    .on("start", () =>
      TL.set(".bar-graph-2--bar", {
        autoAlpha: 1
      })
      .staggerFrom(
        ".bar-graph-2--bar",
        0.5, {
          scaleX: 0,
          transformOrigin: "left center",
          ease: Power1.easeIn
        },
        0.1
      )
      .to(".bar-graph-2 text", 0.25, {
        autoAlpha: 1
      }))
    .addTo(controller);
}

function scrollMagicCustomGraph_03() {
  const controller = new ScrollMagic.Controller();
  const scene = new ScrollMagic.Scene({
      triggerElement: ".bar-graph-3",
      duration: 250,
      reverse: false
    })
    .on("start", () =>
      TL.set(".bar-graph-3 rect, .bar-graph-3 line", {
        autoAlpha: 1
      })
      .staggerFrom(
        ".bar-graph-3 rect",
        0.5, {
          scaleY: 0,
          transformOrigin: "bottom center",
          ease: Power1.easeIn
        },
        0.1
      )
      .to(".bar-graph-3 text", 0.25, {
        autoAlpha: 1
      })
      .from(".bar-graph-3 line", 0.25, {
        scale: 0,
        transformOrigin: "center center"
      })
    )
    .addTo(controller);
}

function scrollMagicGraphs(externalAnimation, target, triggerElement) {
  const controller = new ScrollMagic.Controller();
  const scene = new ScrollMagic.Scene({
      triggerElement,
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
        .on("start", function () {
          return externalAnimation(target.animationTarget, target.stats);
        })
        .addTo(controller);
    });
  }

  function init() {
    targets = [{
      triggerNode: "#stats_02",
      animationTarget: nodeListToArray("#stats_02 .stat-number"),
      stats: [6]
    }];

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
  scrollMagicGraphs(animateBarChart, '#bar-graph-1', '#stats_02');
  scrollMagicCustomGraph_01();
  scrollMagicCustomGraph_02();
  scrollMagicCustomGraph_03();
}

let scrollDownButton;

App();
