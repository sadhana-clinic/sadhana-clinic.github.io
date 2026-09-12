// Sadhana Clinic — shared interactions
(function(){
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('nav.primary');
  if(toggle && nav){
    toggle.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); });
    });
  }

  // Animated counters (respects reduced motion)
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var counters = document.querySelectorAll('[data-count]');
  if(counters.length){
    if(reduceMotion || !('IntersectionObserver' in window)){
      counters.forEach(function(el){ el.textContent = el.getAttribute('data-count'); });
    } else {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(!entry.isIntersecting) return;
          var el = entry.target;
          io.unobserve(el);
          var target = parseFloat(el.getAttribute('data-count').replace(/[^0-9.]/g,''));
          var suffix = el.getAttribute('data-count').replace(/^[0-9.,]+/,'');
          var start = 0, duration = 1100, startTime = null;
          function step(ts){
            if(!startTime) startTime = ts;
            var progress = Math.min((ts - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var val = Math.round(start + (target - start) * eased);
            el.textContent = val.toLocaleString('en-IN') + suffix;
            if(progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      }, { threshold: 0.4 });
      counters.forEach(function(el){ io.observe(el); });
    }
  }

  // Package filter + search (Health Packages sections)
  var toolbar = document.querySelector('[data-pkg-toolbar]');
  if(toolbar){
    var filterButtons = toolbar.querySelectorAll('.chip-filter');
    var searchInput = toolbar.querySelector('input[type="search"]');
    var cards = document.querySelectorAll('[data-pkg-card]');
    var activeCat = 'all';

    function applyFilters(){
      var q = (searchInput && searchInput.value || '').trim().toLowerCase();
      var visibleCount = 0;
      cards.forEach(function(card){
        var cat = card.getAttribute('data-cat');
        var text = card.textContent.toLowerCase();
        var matchesCat = activeCat === 'all' || cat === activeCat;
        var matchesSearch = !q || text.indexOf(q) !== -1;
        var show = matchesCat && matchesSearch;
        card.hidden = !show;
        if(show) visibleCount++;
      });
      var noResults = document.getElementById('no-results');
      if(noResults){ noResults.style.display = visibleCount === 0 ? 'block' : 'none'; }
    }
    filterButtons.forEach(function(btn){
      btn.addEventListener('click', function(){
        filterButtons.forEach(function(b){ b.setAttribute('aria-pressed','false'); });
        btn.setAttribute('aria-pressed','true');
        activeCat = btn.getAttribute('data-cat');
        applyFilters();
      });
    });
    if(searchInput){ searchInput.addEventListener('input', applyFilters); }
  }

  // Demo appointment form (prototype — no backend; shows an inline confirmation)
  var demoForm = document.querySelector('[data-demo-form]');
  if(demoForm){
    demoForm.addEventListener('submit', function(e){
      e.preventDefault();
      var success = document.querySelector('[data-form-success]');
      if(success){
        success.hidden = false;
        success.setAttribute('tabindex','-1');
        success.focus();
        success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      }
    });
  }

  // Footer year
  var yearEl = document.querySelector('[data-year]');
  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }
})();
