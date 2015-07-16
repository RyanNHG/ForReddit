
const CLIENT_ID = '90d0236be1e55f5';

$(document).ready(onReady);

function onReady()
{
    $('#btn_subreddit').click(function()
    {
        $('#modal_subreddit').modal('show');
    });

    $('#input_searchSubreddit').keypress(function (e) {
      if (e.which == 13) {
        loadSubreddit($(this).val());
        $('#modal_subreddit').modal('hide');
        return false;
      }
    });

    $('#modal_subreddit').on('shown.bs.modal', function () {
      $('#input_searchSubreddit').focus();
    })

    loadSubreddit('pics');
}

function loadSubreddit(subreddit)
{
    $('#btn_subreddit').text('r/' + subreddit);

    var url = buildSubredditUrl(subreddit);
    $.getJSON(url, subredditDataLoaded);
}

    function buildSubredditUrl(subreddit)
    {
        return 'http://api.reddit.com/r/' + subreddit;
    }

    function subredditDataLoaded(data)
    {
        var posts = data.data.children;
        for(var i = 0; i < posts.length; i++)
        {
            var post = posts[i].data;

            addPanel(post.title, post.author, post.thumbnail, post.url);
        }
    }

    function addPanel(title, author, thumbnail, link)
    {
        var icon = '<img class="media-object post_thumbnail" src="'+thumbnail+'" alt="...">';
        var imgurId = '';

        if(thumbnail == 'nsfw')
            icon = '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>';
        
        if(link == 'self')
        {
            icon = '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>';
        }
        else if(link.indexOf('imgur') != -1)
        {
            var id = getImgurId(link);
            console.log(id);
            imgurId = 'imgurId'+id;

            getImageTag(id);
        }

        var html = 
        '<div class="col-xs-12 post">'+
        '<div class="panel panel-default">'+
          '<div class="panel-heading">'+
            '<div class="media">'+
              '<div class="media-left">'+
                '<a class="post_link" href="'+link+'">'+
                  icon+
                '</a>'+
              '</div>'+
              '<div class="media-body">'+
                '<h4 class="media-heading post_title">'+title+'</h4>'+
                '<span class="post_author">'+author+'</span>'+
              '</div>'+
            '</div>'+
          '</div>'+
          '<div class="panel-body" id="'+imgurId+'">'+
            //  CONTENT GOES HERE
          '</div>'
        '</div>'+
        '</div>';

        $('#div_mainContent').append(html);
    }

//  IMGUR


function getImageTag(id)
{
    $.ajax({
        url : 'https://api.imgur.com/3/image/'+id,
        type : 'GET',
        contentType : 'application/json',
        dataType : 'json',
        success : function(Result) {
           $('#imgurId'+id).append('<img src="'+Result.data.link+'">');
        },
        beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Client-ID ' + CLIENT_ID);
        },
        error: function (RcvData, error) {
            console.log(error);
        }
      });

}

function getImgurId(url)
{
    //  0123456789abcdefghijklmn
    //  http://imgur.com/zZltUtS
    //console.log(url);

    var lastSlashIndex = 0;
    var num = 0;
    var periodIndex = url.length;

    //  while the url after the slash contains a slash, loop
    while(url.substring(lastSlashIndex).indexOf('/') > -1)
    {
        // update lastSlashIndex to this value

        lastSlashIndex += url.substring(lastSlashIndex).indexOf('/')+1;

        if(lastSlashIndex == -1)
            return 'FAILED TO FIND IMGUR ID';
        num++;
    }

    if(url.substring(lastSlashIndex).indexOf('.') != -1)
        periodIndex = url.substring(lastSlashIndex).indexOf('.') + lastSlashIndex;

    return url.substring(lastSlashIndex,periodIndex);

}