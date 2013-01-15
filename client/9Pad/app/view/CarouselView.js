Ext.define('9Pad.view.CarouselView', {
    extend: 'Ext.Container',
    requires: [
        'Ext.Label',
        'Ext.carousel.Carousel',
        '9Pad.view.ContentCardView'
    ],
    xtype: 'overview',
    config: {
        layout: 'vbox',
        fullscreen: true,
        id: 'overview',
        items: [
            {
                xtype: 'container',
                id: 'upperDropZone',
                flex: 1,
                style: {
                    width: '100%',
                    opacity: 0.3
                }
            },
            {
                xtype: 'carousel',
                id: 'carouselView',
                flex: 3,

                defaults: {
                    styleHtmlContent: true
                },

                style: {
                    width: '100%'
                },

                items: [
                    {
                        xtype : 'contentcard',
                        contentImages: [
                            '/resources/images/Kacheln iPad-Matrix.jpg',
                            '/resources/images/Kacheln iPad-Matrix2.jpg',
                            '/resources/images/Kacheln iPad-Matrix3.jpg'
                        ]
                    },
                    {
                        xtype : 'contentcard',
                        contentImages: [
                            '/resources/images/Kacheln iPad-Matrix4.jpg',
                            '/resources/images/Kacheln iPad-Matrix5.jpg',
                            '/resources/images/Kacheln iPad-Matrix6.jpg'
                        ]
                    },
                    {
                        xtype : 'contentcard',
                        contentImages: [
                            '/resources/images/Kacheln iPad-Matrix7.jpg',
                            '/resources/images/Kacheln iPad-Matrix8.jpg',
                            '/resources/images/Kacheln iPad-Matrix9.jpg'
                        ]
                    },
                    {
                        xtype : 'contentcard',
                        contentImages: [
                            '/resources/images/Kacheln iPad-Matrix10.jpg',
                            '/resources/images/Kacheln iPad-Matrix11.jpg',
                            '/resources/images/Kacheln iPad-Matrix12.jpg'
                        ]
                    },
                    {
                        xtype : 'contentcard',
                        contentImages: [
                            '/resources/images/Kacheln iPad-Matrix13.jpg',
                            '/resources/images/Kacheln iPad-Matrix14.jpg',
                            '/resources/images/Kacheln iPad-Matrix15.jpg'
                        ]
                    },
                    {
                        xtype : 'contentcard',
                        contentImages: [
                            '/resources/images/Kacheln iPad-Matrix16.jpg',
                            '/resources/images/Kacheln iPad-Matrix17.jpg',
                            '/resources/images/Kacheln iPad-Matrix18.jpg'
                        ]
                    },
                    {
                        xtype : 'contentcard',
                        contentImages: [
                            '/resources/images/Kacheln iPad-Matrix19.jpg',
                            '/resources/images/Kacheln iPad-Matrix20.jpg',
                            '/resources/images/Kacheln iPad-Matrix21.jpg'
                        ]
                    },
                    {
                        xtype : 'contentcard',
                        contentImages: [
                            '/resources/images/Kacheln iPad-Matrix22.jpg',
                            '/resources/images/Kacheln iPad-Matrix23.jpg',
                            '/resources/images/Kacheln iPad-Matrix24.jpg'
                        ]
                    }

                ]
            },
            {
                xtype: 'container',
                id: 'lowerDropZone',
                flex: 1,
                style: {
                    width: '100%'
                }
            }
        ]
    }
});
