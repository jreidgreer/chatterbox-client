// YOUR CODE HERE:

var app = {
  messages: '',
  rooms: [],
  friends: [],
  server: 'https://api.parse.com/1/classes/messages',
  currentRoom: 'all',
  addFriend: function(e) {
    var $addedName = $(e.target).data('username');
    app.friends.push($addedName);
    app.displayMessages(app.currentRoom);
  },
  escaper: function(input) {
    return encodeURI(input).replace(/%20/g, ' ');
  },
  
  addMessage: function(message) {
    var $container = $('<div class="chat"></div>');
    var $name = $('<div class="username"></div>');
    var $message = $('<div class="message"></div>');
    $name.text(this.escaper(message.username));
    $name.attr('data-username', this.escaper(message.username));
    if (this.friends.indexOf(message.username) !== -1) {
      $name.addClass('friend');
    }
    $container.append($name);
    $message.text(this.escaper(message.text));

    $container.append($message);
    $('#chats').append($container);
  },
  addRoom: function(roomname) {
    if (this.rooms.indexOf(roomname) === -1 && roomname !== null && roomname) {
      this.rooms.push(this.escaper(roomname));

      var $roomOption = $('<option class="room"></option>').text(this.escaper(roomname));
      $roomOption.attr('value', this.escaper(roomname));
      $('#roomSelect').append($roomOption);
    }
  },
  clearMessages: function() {
    $('#chats').empty();
  },
  
  displayMessages: function(room) {
    this.clearMessages();

    if (room !== 'all') {
      for (var i = 0; i < this.messages.length; i++) {
        var current = this.messages[i];
        if (!current.text || !current.username || 
          current.text.length === 0 || current.username.length === 0) {
          continue;
        }
        if (current.roomname !== room) {
          continue;
        }
        this.addMessage(current);
      }
    } else {
      for (var i = 0; i < this.messages.length; i++) {
        var current = this.messages[i];
        if (!current.text || !current.username || 
          current.text.length === 0 || current.username.length === 0) {
          continue;
        }
        this.addMessage(current);
      }
    }
  },
  
  fetch: function() {
    $.ajax({
      url: this.server,
      type: 'GET', 
      contentType: 'application/json',
      success: (data) => {
        this.messages = data.results; // is an array
        for (var i = 0; i < this.messages.length; i++) {
          this.addRoom(this.messages[i].roomname);
        }
        this.displayMessages(this.currentRoom);
      },
      error: function(data) {
        console.error('chatterbox: Failed to get messages', data);
      }
    });
  },
  
  init: function() {
    setInterval( () => {
      this.fetch();
    }, 5000);
    this.fetch();
    $('#messageForm').on('submit', function(event) {
      event.preventDefault();
      app.handleSubmit();
    });

    $('#roomSelect').on('change', function(event) {
      if ($(this).val() === 'newRoom') {
        var newRoom = prompt('Name new room: ') || 'all';
        app.addRoom(newRoom);
        app.currentRoom = newRoom;
        $(this).val(newRoom);
      } else {
        app.currentRoom = $(this).val();
      }
      app.displayMessages(app.currentRoom);
    });
    $('#chats').on('click', '.username', app.addFriend);
  },

  send: function(message) {
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: () => {
        console.log('chatterbox: Message sent');
        this.fetch();
      },
      error: function(data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  handleSubmit: function() {
    var newMessage = $('#newMessage').val();
    var messageObject = {
      username: decodeURIComponent(window.location.search.slice(10)),
      text: newMessage,
      roomname: app.currentRoom
    };
    this.send(messageObject);
    $('form')[0].reset();
  }

};

app.init();