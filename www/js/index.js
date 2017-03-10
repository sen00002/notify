
var app = {
    localNote: null,
    init: function() {
        try{
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        }catch(e){
            document.addEventListener('DOMContentLoaded', this.onDeviceReady.bind(this), false);
            console.log('failed to find deviceready');
        }
    },
    onDeviceReady: function() {
        //set up event listeners and default variable values
        window.addEventListener('push', app.pageChanged);
        //cordova.plugins.notification.local
        app.localNote = cordova.plugins.notification.local;
        app.localNote.on("click", function (notification) {
            
        });
        //show the list when loading
        app.showList();
    },
    pageChanged: function(){
        //user has clicked a link in the tab menu and new page loaded
        //check to see which page and then call the appropriate function
        
        let pageChanged = document.querySelector('#page-notify');
        if(pageChanged){
            app.showList();
        }
        else{
            
            let button = document.querySelector('#btnAdd');
            button.addEventListener("click", app.saveNew);
            console.log("Button is clicked and function saveNew is called");
            
            let notificationTime = new Date();
            notificationTime.setMinutes(notificationTime.getMinutes() + 2);
            console.log(notificationTime);
            
            let time = document.querySelector('#time');
            time.value = notificationTime.toString();
            console.log("Time is " + time);
            
            }
    },
    showList: function(){
        let list = document.querySelector('#list-notify');
        
        app.localNote.getAllIds(function (ids){
            ids.forEach(function (id){
                app.localNote.get(id, function(notification){
                    //Creating all the HTML tags 
                    let div = document.createElement('div');
                    console.log(div);
                    let li = document.createElement('li');
                    console.log(li);
                    let span = document.createElement('span');
                    console.log(span);
                    let badge = document.createElement('span');
                    console.log(badge);
                    
                    //Giving all the HTML it's className
                    div.className = 'main';
                    li.className = 'main-list';
                    span.className = 'main-span icon icon-trash';
                    badge.className = 'main-badge';
                    
                    //Appeneding all the element inside the list tag
                    li.appendChild(span);
                    li.appendChild(div);
                    
                    //Set the timer
                    let time = notification.at * 1000;
                    console.log("Notification at 1000 is " + time);
                    let date = new Date(time);
                    console.log("The date is " + date);
                    div.textContent = notification.title + ' - ' + date.toLocaleString();
                    badge.textContent = notification.badge;
                    div.appendChild(badge);

                    span.setAttribute('one-note', notification.id);
                    list.appendChild(li); 
                    
                    //For the deleting the notification from the list
                     span.addEventListener('click', function (ev) {
                        let deleteIcon = ev.currentTarget;
                        let listItem = deleteIcon.parentElement;
                        let id = deleteIcon.getAttribute('one-note');
                        app.localNote.cancel(id, function () {
                            listItem.parentElement.removeChild(listItem);
                        });
                    })
                    
                });
            });
        });
        
        
    },
    saveNew: function(ev){
        ev.preventDefault();
        //create a new notification with the details from the form
        
        app.localNote.getAllIds(function (ids){
            let lastNotifications = ids[ids.length - 1];
            lastNotifications += 1;
            
            
            let title = document.getElementById('title').value;
            console.log("The Title is: " + title);
            let messageBody = document.getElementById('msg').value;
            console.log("The Message is: " + messageBody);
            let time = document.getElementById('time').value;
            console.log("The Time is: " + time);
            
            let currentDate = new Date(time);
            console.log(currentDate);
            
               app.localNote.schedule({
                id: lastNotifications,
                title: title,
                text: messageBody,
                at: currentDate,
                badge: "Test",
             
            })
        })
    }
};

app.init();