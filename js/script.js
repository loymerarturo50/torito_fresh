// Agua Torito Fresh - Vanilla JS
// Solo WhatsApp + UI sin backend
(function(){
  const CONFIG = {
    whatsappNumber: "51999999999", // Reemplazar sin + ni espacios
    messages: {
      general: "Hola, Agua Torito Fresh. Quiero hacer un pedido de agua.",
      hogar: "Hola, Agua Torito Fresh. Quiero pedir agua para mi hogar.",
      negocio: "Hola, Agua Torito Fresh. Quiero pedir agua para mi negocio.",
      producto: function(nombre, cap){ return "Hola, Agua Torito Fresh. Quiero pedir un " + nombre + " de " + cap + "."; }
    }
  };

  function waLink(msg){
    return "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(msg);
  }

  // Tema claro/oscuro
  function applyTheme(t){
    document.documentElement.setAttribute('data-theme', t);
    try{ localStorage.setItem('torito-theme', t); }catch(e){}
    var btn=document.getElementById('themeBtn');
    if(btn) btn.setAttribute('aria-label', t==='dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  }

  document.addEventListener("DOMContentLoaded", function(){
    // Toggle tema
    var themeBtn=document.getElementById('themeBtn');
    if(themeBtn){
      themeBtn.addEventListener('click', function(){
        var cur=document.documentElement.getAttribute('data-theme') || 'light';
        applyTheme(cur==='dark' ? 'light' : 'dark');
      });
      // inicializar label
      var cur=document.documentElement.getAttribute('data-theme') || 'light';
      themeBtn.setAttribute('aria-label', cur==='dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    }

    // Mensajes generales
    document.querySelectorAll("[data-wa]").forEach(function(el){
      var type = el.getAttribute("data-wa");
      var msg = CONFIG.messages[type] || CONFIG.messages.general;
      el.setAttribute("href", waLink(msg));
      el.setAttribute("target","_blank");
      el.setAttribute("rel","noopener noreferrer");
    });
    // Productos
    document.querySelectorAll("[data-wa-product]").forEach(function(el){
      var nombre = el.getAttribute("data-wa-product");
      var cap = el.getAttribute("data-wa-cap") || "20 L";
      var msg = CONFIG.messages.producto(nombre, cap);
      el.setAttribute("href", waLink(msg));
      el.setAttribute("target","_blank");
      el.setAttribute("rel","noopener noreferrer");
    });

    // Menu móvil
    var btn = document.getElementById("menuBtn");
    var nav = document.getElementById("mobileNav");
    if(btn && nav){
      btn.addEventListener("click", function(){
        var open = nav.classList.toggle("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      nav.querySelectorAll("a").forEach(function(a){
        a.addEventListener("click", function(){
          nav.classList.remove("open");
          btn.setAttribute("aria-expanded","false");
        });
      });
    }

    // Reveal on scroll
    var reveals = document.querySelectorAll(".reveal");
    if("IntersectionObserver" in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting) e.target.classList.add("visible");
        });
      }, {threshold:0.15});
      reveals.forEach(function(el){ io.observe(el); });
    } else {
      reveals.forEach(function(el){ el.classList.add("visible"); });
    }

    // Año footer
    var year = document.getElementById("year");
    if(year) year.textContent = new Date().getFullYear();

    // Armado animado del bidón (scroll-scrubbed)
    initAssembly();
  });

  function initAssembly(){
    var wrap = document.querySelector("[data-assembly]");
    if(!wrap) return;

    // Reduced motion o navegador sin soporte: se queda el estado final estático (CSS base)
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduceMotion) return;
    if(!("IntersectionObserver" in window) || !window.requestAnimationFrame) return;

    var stage = wrap.querySelector(".assembly-stage");
    var ticking = false;
    var lastProgress = -1;
    var active = false;

    function clamp01(n){ return Math.max(0, Math.min(1, n)); }

    function computeProgress(){
      var rect = wrap.getBoundingClientRect();
      var vh = window.innerHeight;
      var total = rect.height - vh;
      if(total <= 0) return rect.top <= 0 ? 1 : 0;
      return clamp01(-rect.top / total);
    }

    function applyProgress(p){
      stage.style.setProperty("--fill", clamp01((p - 0.10) / 0.45).toFixed(4));
      stage.classList.toggle("show-drops", p < 0.20);
      stage.classList.toggle("show-cap", p >= 0.55);
      stage.classList.toggle("show-tap", p >= 0.78);
    }

    function onScroll(){
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(function(){
        var p = computeProgress();
        if(Math.abs(p - lastProgress) > 0.0015){
          applyProgress(p);
          lastProgress = p;
        }
        ticking = false;
      });
    }

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting && !active){
          active = true;
          window.addEventListener("scroll", onScroll, {passive:true});
          window.addEventListener("resize", onScroll);
          onScroll();
        } else if(!e.isIntersecting && active){
          active = false;
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onScroll);
          // Fija el estado final según por dónde salió, por si un salto de scroll
          // muy rápido (tecla Fin, fling) dejó el progreso a medio calcular.
          var p = e.boundingClientRect.top < 0 ? 1 : 0;
          applyProgress(p);
          lastProgress = p;
        }
      });
    }, {rootMargin:"200px 0px 200px 0px"});
    io.observe(wrap);

    wrap.classList.add("is-active");
  }
})();
