Ext.define('9Pad.controller.CarouselController', {
    extend: 'Ext.app.Controller',

    requires: [
        '9Pad.view.CarouselView',
        'Ext.util.Draggable',
        'Ext.ux.util.Draggable',
        'Ext.ux.util.Droppable'
    ],

    config: {
        refs: {
            overview: '#overview',
            carouselView: '#carouselView',
            cardSwitchButton: '#cardSwitchButton',
            upperDropZone: '#upperDropZone',
            lowerDropZone: '#lowerDropZone'
        },
        control: {
            overview: {
                initialize: 'onOverviewInit'
            },

            cardSwitchButton: {
                tap: function() {
                    this.sendCardSwitchBroadcast(2);
                }
            },
            carouselView: {
                activeitemchange: 'onCardSwitch'
            }
        }
    },

    connection: undefined,
	connectionOpen: false,
//    cardSwitchesToIgnore: [],
    dragging: false,
    keepAliveTimer: undefined,
	bubble: undefined,
	lastUpdate: new Date().getTime(),

    init: function(){
        this.initWebSocket();
    },

    onOverviewInit: function(overview) {
        var me = this;
        Ext.get('overview').dom.onmousemove = function(event) {
            me.onMouseMovement(event);
        }
    },

    prepareCarouselViewWithColumn: function(column) {
        var carouselView = this.getCarouselView();
        carouselView.column = column;
        this.moveCarouselToStartingPosition(carouselView);
        this.initCarouselDragging(carouselView);
    },

    moveCarouselToStartingPosition: function(carouselView) {
        console.log("Moving carousel to starting point:");
        console.log(carouselView);
        var startIndex = this.getCarouselView().column;
/*        this.cardSwitchesToIgnore.push(startIndex); */
        carouselView.setActiveItem(startIndex);
    },

    initCarouselDragging: function(carouselView) {
        var me = this;
        Ext.Array.each(carouselView.getInnerItems(), function(contentCard) {
            Ext.each(contentCard.getInnerItems(), function(item) {
                if (Ext.isDefined(item.draggableBehavior)) {
                    var draggable = item.draggableBehavior.getDraggable();

                    draggable.group = 'base'; // Default group for droppable
                    draggable.revert = true;

                    draggable.setConstraint({
                        min: { x: -Infinity, y: -Infinity },
                        max: { x: Infinity, y: Infinity }
                    });

                    draggable.on({
                        scope: me,
                        dragstart: me.onDragStart,
                        drag: me.onDrag,
                        dragend: me.onDragEnd
                    });
                } else {
                    console.log("Element not draggable:");
                    console.log(item);
                }
            });
        });
    },

    initWebSocket: function() {
        var self = this;
        // if user is running mozilla then use its built-in WebSocket
        window.WebSocket = window.WebSocket || window.MozWebSocket;
		self.connect();
	},
	
	connect: function() {
		var self = this;
		console.log("Opening WebSocket to " + coordinationServerBaseIP + "...");

        this.connection = new WebSocket('ws://' + coordinationServerBaseIP + ':1337');		
		
		this.connection.onopen = function () {
			self.connectionOpen = true;
			console.log("Websocket open.");
		};
		
        this.connection.onerror = function (error) {
			console.log("Connection failed. Retrying...");
			
			self.connectionOpen = false;

            //alert('Sorry, but there\'s some problem with your connection or the server is down.');
			self.connection = undefined;
			setTimeout(function() {self.connect(), 5000});
        };
		
		this.connection.onmessage = function(message) {
			self.handleUpdateMessage.call(self, message);
		};
    },

    sendKeepAlive: function(connection) {
        var self = this;
        console.log('keepAlive');
        connection.send(JSON.stringify({
            "command": "keepAlive"
        }));
        return setTimeout(function() {self.sendKeepAlive(connection);}, 180000);
    },

    onMouseMovement: function(event) {
        return this.onTouchMovement(event.clientX, event.clientY);
    },

    onTouchMovement: function(x, y) {
        var windowHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height,
            dropZoneBorder = windowHeight / 2 - windowHeight / 5,
            absDeltaY = Math.abs((windowHeight / 2) - y),
            opacity = 1 - (((dropZoneBorder - absDeltaY) / dropZoneBorder)),
            size = (opacity > 1) ? 227 : opacity * 227;
        // console.log("height="+windowHeight+" x="+x+" y="+y+" absDeltaY="+absDeltaY+" opacity="+opacity+" dropZoneBorder="+dropZoneBorder);
        if (this.dragging) {
			this.bubble.css({'top':y-size/2,'left':x-size/2,'width':size,'height':size,'opacity':opacity});
        }
    },

    onDragStart: function(draggable, event) {
        var x = event.startX,
            y = event.startY,
            me = this;
        console.log('Start dragging', arguments);
        me.dragging = true;
		me.initBubble();
		me.bubble.css({'width':227,'height':227,'top':y-114,'left':x-114,'visibility':'visible','opacity':0});
    },

    onDrag: function(draggable, event, offsetX, offsetY) {
        return this.onTouchMovement(event.pageX, event.pageY);
    },

    onDragEnd: function(draggable, event) {
        var me = this,
            absDeltaX = event.absDeltaX,
            x = event.pageX,
            y = event.pageY,
            windowHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height,
            windowWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        if (absDeltaX < windowWidth / 3) {
            if (y < windowHeight / 5) {
                me.onDropUpper(draggable, x, y);
				me.bubble.animate({
                    width: '0px',
                    height: '0px',
                    top: 0,
                    opacity: 0,
                    left: x
                }, 500 );
            } else if (y > windowHeight * 4 / 5) {
                me.onDropLower(draggable, x, y);
				me.bubble.animate({
                    width: '0px',
                    height: '0px',
                    top: windowHeight,
                    opacity: 0,
                    left: x
                }, 500 );

            }
            else {
				me.bubble.animate({
                    width: '0px',
                    height: '0px',
                    top: windowHeight / 2,
                    opacity: 0,
                    left: event.startX
                }, 800 );
            }
        } else {
			me.bubble.animate({
                width: '0px',
                height: '0px',
                top: windowHeight / 2,
                opacity: 0,
                left: event.startX
            }, 800 );
        }
        me.dragging = false;
		me.releaseBubble();
    },

    onDropUpper: function(draggable, x, y) {
        this.sendShowContentBroadcast(this.getContentIndexFromDraggable(draggable), 0);
    },

    onDropLower: function(draggable, x, y) {
        this.sendShowContentBroadcast(this.getContentIndexFromDraggable(draggable), 2);
    },

    getContentIndexFromDraggable: function(draggable) {
        var draggedElement = draggable.getElement(),
            contentId = draggedElement.id;
        return parseInt(contentId.substring(8));
    },

    sendShowContentBroadcast: function(contentIndex, targetRow) {
        var column = this.getCarouselView().column,
            showBroadcast = {
                "command": "show",
                "contentIndex": contentIndex,
                "target": {
                    "row": targetRow,
                    "column": column
                }
            };
//        console.log("Sending content view broadcast: ", contentIndex, showBroadcast);
		if (this.connectionOpen != true) {
			this.connect();
		}
		
		if (this.connectionOpen === true) {
			this.connection.send(JSON.stringify(showBroadcast));
		}
    },

    onCardSwitch: function(self, value, oldValue) {
		if (value != oldValue) {
			var index = self.getItems().indexOf(value) - 1;
//        if (this.cardSwitchesToIgnore.shift() !== index) {
			this.sendCardSwitchBroadcast(index);
		}
//		}
    },

    sendCardSwitchBroadcast: function(newIndex) {
        var moveBroadcast,
            column = this.getCarouselView().column;
        moveBroadcast = {
            "command": "move",
            "cardIndex": newIndex,
            "sourceColumn": column
        };
		if (this.connectionOpen != true) {
			this.connect();
		}
		if (this.connectionOpen === true) {
			this.connection.send(JSON.stringify(moveBroadcast));
		}
    },

    doLogout: function() {
        // called whenever any Button with action=logout is tapped
    },

    handleUpdateMessage: function(message) {
        var json,
            cardIndex,
            sourceColumn,
            column = this.getCarouselView().column,
			now = new Date().getTime(),
			timeDiff;
			
        try {
            json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like valid JSON: ', message.data);
            return;
        }

        if (json.command === 'move') {
            cardIndex = json.cardIndex;
            sourceColumn = json.sourceColumn;
			
			// Prevent uncontrolled "skipping": Debounce move events
			timeDiff = now - this.lastUpdate;
			console.log("timeDiff=" + timeDiff);			
			if (timeDiff > 500) {			
				this.lastUpdate = now;
				if (sourceColumn != column ) {
					this.switchCard(cardIndex + (column - sourceColumn), sourceColumn);					
				} else {
					console.log("Ignored move cmd from self: " + sourceColumn);
				}
			} else {
				console.log("Bounced move cmd : " + sourceColumn + " ( " + timeDiff + ")");
			}
        }
    },

    switchCard: function(newIndex, sourceColumn) {
        console.log("Switching card to new index: " + newIndex + " (source: " + sourceColumn + ")");
        var carouselView = this.getCarouselView(),
            activeIndex = carouselView.getActiveIndex(),
            diff = newIndex - activeIndex,
            jumpIndex;
        if (Math.abs(diff) > 0) {
            if (Math.abs(diff) > 1) {
                if (diff > 0) {
                    jumpIndex = newIndex - 1;
                } else {
                    jumpIndex = newIndex + 1;
                }
//                this.cardSwitchesToIgnore.push(jumpIndex);
                carouselView.setActiveItem(jumpIndex);
//            } else {
//				this.cardSwitchesToIgnore.push(newIndex);
			}
            if (diff > 0) {
                carouselView.next();
            } else {
                carouselView.previous();
            }
        }
        if (!this.keepAliveTimer) {
            this.keepAliveTimer = this.sendKeepAlive(this.connection);
        }
    },
	
	initBubble: function () {
		var me = this,
		    rnd = Math.round(Math.random() * 4);
		if (rnd == 0) {
			me.bubble = $('#bubble_blue');
		} else if (rnd == 1) {
			me.bubble = $('#bubble_red');
		} else if (rnd == 2) {
			me.bubble = $('#bubble_green');
		} else {
			me.bubble = $('#bubble_yellow');
		}		
	},
	
	releaseBubble: function() {
		this.bubble = undefined;
	}
});