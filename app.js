
const formatter = new Intl.NumberFormat('tr-TR', {style: 'currency', currency: 'TRY'})

var app1 = new Vue({
  el: '#app1',
  data: {
    kkdf: 15,
    bsmf: 5,
    faiz_: 1.39,
    kredi: 10000,
    vade: 12,
  },
  methods: {
    calculate: function () {

      let taksit = this.taksit;
      let odenen_faiz = this.kredi * this.faiz_ * 0.01;
      let odenen_vergi = odenen_faiz * this.vergiler;
      let odenen_faiz_ve_vergi = this.kredi * this.faiz ;
      let odenen_kredi = taksit - odenen_faiz_ve_vergi;
      let kalan = this.kredi - odenen_kredi;

      let results = {
        'vade': [
          {
            1: {
              'kalan': formatter.format(kalan),
              'odenen': formatter.format(odenen_kredi),
              'faiz': formatter.format(odenen_faiz),
              'vergi': formatter.format(odenen_vergi),
              'taksit': formatter.format(taksit),
            }
          }
        ],
        'toplam': {
          't_odenen': odenen_kredi,
          't_faiz': odenen_faiz,
          't_vergi': odenen_vergi,
          't_taksit': taksit,
        }
      }

      if (this.vade > 1) {
        for (var ay = 2; ay <= this.vade; ay++) {
          
          odenen_faiz = kalan * this.faiz_ * 0.01;
          odenen_vergi = odenen_faiz * this.vergiler;
          odenen_faiz_ve_vergi = kalan * this.faiz;
          odenen_kredi = taksit - odenen_faiz_ve_vergi;
          kalan -= odenen_kredi;

          results.toplam.t_odenen += odenen_kredi;
          results.toplam.t_faiz += odenen_faiz;
          results.toplam.t_vergi += odenen_vergi;
          results.toplam.t_taksit += taksit;

          let obj = {};
          obj[ay] = {
            'kalan': formatter.format(kalan),
            'odenen': formatter.format(odenen_kredi),
            'faiz': formatter.format(odenen_faiz),
            'vergi': formatter.format(odenen_vergi),
            'taksit': formatter.format(taksit)
          }

          results.vade.push(obj);

        }
      }

      results.toplam.t_odenen = formatter.format(results.toplam.t_odenen)
      results.toplam.t_faiz = formatter.format(results.toplam.t_faiz)
      results.toplam.t_vergi = formatter.format(results.toplam.t_vergi)
      results.toplam.t_taksit = formatter.format(results.toplam.t_taksit)

      return results;
    }

  },
  computed: {
    faiz: function () {
      return (1 + ((this.kkdf + this.bsmf) * 0.01)) * this.faiz_ * 0.01;
    },
    vergiler: function () {
      return (this.kkdf + this.bsmf) * 0.01;
    },
    taksit: function () {
      return this.kredi * ( (this.faiz * Math.pow((1 + this.faiz), this.vade)) / (Math.pow((1 + this.faiz), this.vade) - 1) )
    },
    tablo: function () {
      return this.calculate().vade;
    },
    toplam: function () {
      return this.calculate().toplam;
    },
  },
})

var app2 = new Vue({
  el: '#app2',
  data: {
    anapara: 10000,
    faiz_: 10,
    vergi: 15,
    vade: 30,
    donem: 12,
  },
  computed: {
    tablo: function () {
      return this.hesapla().vade;
    },
    toplam: function () {
      return this.hesapla().toplam;
    },
  },
  methods: {
    hesapla: function () {
      let anapara = this.anapara
      let faiz = anapara * this.faiz_ * this.vade / 36500;
      let vergi = faiz * this.vergi * 0.01;
      let net = faiz - vergi;

      let results = {
        'vade': [
          {
            1: {
              'anapara': formatter.format(anapara),
              'faiz': formatter.format(faiz),
              'vergi': formatter.format(vergi),
              'net': formatter.format(net),
            }
          }
        ],
        'toplam': {
          't_faiz': faiz,
          't_vergi': vergi,
          't_net': net,
        }
      }

      if (this.donem > 1) {
        for (var donem = 2; donem <= this.donem; donem++) {
          
          anapara += net;
          faiz = anapara * this.faiz_ * this.vade / 36500;
          vergi = faiz * this.vergi * 0.01;
          net = faiz - vergi;

          results.toplam.t_faiz += faiz;
          results.toplam.t_vergi += vergi;
          results.toplam.t_net += net;

          let obj = {};
          obj[donem] = {
            'anapara': formatter.format(anapara),
            'faiz': formatter.format(faiz),
            'vergi': formatter.format(vergi),
            'net': formatter.format(net),
          }

          results.vade.push(obj);
        }
      }

      results.toplam.t_faiz = formatter.format(results.toplam.t_faiz)
      results.toplam.t_vergi = formatter.format(results.toplam.t_vergi)
      results.toplam.t_net = formatter.format(results.toplam.t_net)

      return results;

    }
  }
})

function openTab(evt, tabName) {
  var i, x, tablinks;
  x = document.getElementsByClassName("content-tab");
  for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tab");
  for (i = 0; i < x.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" is-active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " is-active";
}
