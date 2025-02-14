
Page({
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    name: '',
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园'
    }],
    circles:[{
      latitude: '',
      longitude:'',
      color: '#FF0000DD',
      fillColor: '#7cb5ec88',
      radius: 3000,
      strokeWidth: 1
    }],
    // covers: [{
    //   latitude: 23.099994,
    //   longitude: 113.344520,
    //   iconPath: ''
    // }, {
    //   latitude: 23.099994,
    //   longitude: 113.304520,
    //   iconPath: ''
    // }]
  },
  onLoad(o) {
    console.log(o)
    this.setData({
      latitude: o.latitude,
      longitude: o.longitude,
      name: o.name,
      markers: [{
        id: "1",
        latitude: o.latitude,
        longitude: o.longitude,
        width: 50,
        height: 50,
        iconPath: "/assets/img/home/device-red.png",
        title: o.name
      }],
      circles: [{
        latitude: o.latitude,
        longitude: o.longitude,
        color: '#FF0000DD',
        fillColor: '#7cb5ec88',
        radius: 1000,
        strokeWidth: 1
      }]
    })
    wx.setNavigationBarTitle({
      'title': this.data.name
    });
  },
  onReady: function(e) {
    this.mapCtx = wx.createMapContext('myMap');
  },
  getCenterLocation: function() {
    this.mapCtx.getCenterLocation({
      success: function(res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function() {
    this.mapCtx.moveToLocation()
  },

  // translateMarker: function () {
  //   this.mapCtx.translateMarker({
  //     markerId: 1,
  //     autoRotate: true,
  //     duration: 1000,
  //     destination: {
  //       latitude: 23.10229,
  //       longitude: 113.3345211,
  //     },
  //     animationEnd() {
  //       console.log('animation end')
  //     }
  //   })
  // },
  // includePoints: function () {
  //   this.mapCtx.includePoints({
  //     padding: [10],
  //     points: [{
  //       latitude: 23.10229,
  //       longitude: 113.3345211,
  //     }, {
  //       latitude: 23.00229,
  //       longitude: 113.3345211,
  //     }]
  //   })
  // }
})