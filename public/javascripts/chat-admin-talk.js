<div class="row">
  <div class="col-xs-1 col-sm-4"></div>
  <div class="col-xs-10 col-sm-4">
  <br>
  <br>
  <ul class="convo list-group"></ul>
    <form>
      <br>
      <br>
      <h2 style="color: hsl(1,0%,80%)">Chat</h2>
      <br>
      <label style="color: hsl(1,0%,80%)">Message</label>
      <br>
      <div class="input-group">
          <span class="input-group-addon">
            <i class="glyphicon glyphicon-user"></i>
          </span>
          <textarea rows="5" cols="50" id="chat" type="text" class="chat-box form-control" name="chat" placeholder="Type your message"></textarea>
      </div>
      <br>
      <input class="form-control btn-primary" value="Send" type="submit">
      <br>
    </form>
      <a class="form-control btn" href="/">Cancel</a>
  </div>
</div>
<script>
  console.log("Running script")
  var socket = io.connect('http://ip:port')
  var socket = io()

  io.on('connection', function(socket){
    socket.on('chat message', function(data) {
        console.log(data)

        $(".convo").text(data);
        $(".convo").append('<li class="list-group-item">' + data + '</li>')
        
    })

    $(function () {
      $('form').submit(function(){
        //console.log($('.chat-box').val())

        // emit the value of the textarea named chat-box
        socket.emit('chat message', $('.chat-box').val());

        // reset the value of the text area to ''
        $('.chat-box').val('');

        // returning false for the self invoking function prevents the browser 
        // from submitting the post request to the server.
        return false;
      })
    })
  })
</script>