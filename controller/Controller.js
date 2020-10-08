class Controller{
    constructor(){
        this.Posts= new Array();
        this.Comments= new Array();
    }
    create_Card(post){
        var icon_featured;
        var art_section="article_section";
        if(post.public === true){
           var icon_public= "fa fa-unlock";
        }else{
            var icon_public= "fa fa-lock";
        }
        if(post.featured === true){
           icon_featured="fa fa-trophy";
           art_section="article_section_p";
        }
        $('<div class="card my-2 mx-2 bg-dark text-white" style="width: 18rem;"><div class="card-body"><article><header ><h5 class="card-title">'+post.title+'<i class="'+icon_featured+' text-white ml-1"></i><i class="'+icon_public+' ml-2"></i></h5></header><p class="card-text mt-4">'+post.body+'</p></article></div><div class="card-footer bg-light"><p class="text-dark">Tag:</p><div id="tag_section"><p class="text-info">'+post.tag+' <br></p></div><p class="text-dark">Lascia un commento:<br></p><input type="text" class="form-control mb-2 comment_text" placeholder="Inserisci il commento"><button class="btn btn-info mt-2 comment_button">Invia</button><ul class="list-group comment_section mt-2"></ul></div></div>').appendTo("#"+art_section+"");
    }
    insert_Post(post_title, post_body, post_featured, post_public, post_tags){
        var new_post=new Post(post_title, post_body, post_featured, post_public, post_tags);
        this.Posts.push(new_post);
        this.create_Card(this.Posts[this.Posts.length-1]);
    }
    add_Post(){
        var post_title=$('#recipient-title').val();
        var post_body=$('#text-body').val();
        var post_tags=($('#tags_area').val()).split(",");
        if($('#Radio1').is(":checked")){
            var post_featured=true;   
        }else{
            var post_featured=false;
        }
        if($('#Radio3').is(":checked")){
            var post_public=true;
        }else{
            var post_public=false;
        }
        this.insert_Post(post_title, post_body, post_featured, post_public, post_tags);
    }
    reset_addmodal(){
        $('#recipient-title').val("");
        $('#text-body').val("");
        $('#tags_area').val("");
        $('#Radio1').prop('checked', false);
        $('#Radio2').prop('checked', false);
        $('#Radio3').prop('checked', false);
        $('#Radio4').prop('checked', false);
        $('#modal_insert').modal('hide');
    }
    insert_Comment(punt){
        var text_com=$(punt.children('.comment_text')).val();
        var comm=new Comment(text_com);
        this.Comments.push(comm);
        $(punt.children('.comment_text')).val("");
        $(punt.children('.comment_section')).append('<li class="list-group-item bg-info">Utente scrive: '+this.Comments[(this.Comments.length)-1].text_comment+'</li>');
    }
    add_Comment(){
        $(document).on('click', '.comment_button', function(){
            var punt= $(this).parent();
            controller.insert_Comment(punt);
        });
    } 
    init_Posts(risposta){
        console.log(risposta);
        for(var i=0;i<risposta.length;i++){
                 this.insert_Post(risposta[i].title, risposta[i].body, risposta[i].featured, risposta[i].public, risposta[i].tag);
                //console.log(risposta[i].tag);
        }
    }
    get_Posts(){
        var punt= this;
        $.ajax({
               url: 'https://texty-89895.firebaseio.com/posts.json',
               method: 'GET',
               success: function(risposta2){
                   var array=Object.values(risposta2);
                   console.log(array);
                   punt.init_Posts(array);     
               },
               error: function(){
                console.log("errore");
           }
        });
    }
    create_Post(){
        
            this.add_Post();
            this.reset_addmodal();
            var post_obj=JSON.stringify(this.Posts[this.Posts.length-1]);
            $.ajax({
                url: 'https://texty-89895.firebaseio.com/posts.json',
                method: 'POST',
                dataType: 'json',
                data: post_obj,
                success: function(){
                    console.log("ole");
                
                    // dato.addProperty("jsgkjhsfg", );    
                },
                error: function(){
                    console.log("errore");
                }    
            })
        
    }
    delete_Posts(){
        $.ajax({
                url: 'https://texty-89895.firebaseio.com/posts.json',
                method: 'DELETE',
                contentType:'application/json',
                success: function(){
                    console.log("ole");
                    // dato.addProperty("jsgkjhsfg", );    
                },
                error: function(){
                    console.log("errore");
                }    
            })
    }
    Patch(){
        var patchDoc = [ { "op": "replace", "path": "/-MJ5vUVF0J518tfckquM/tag", value: "corona" } ];
        $.ajax({
        url: 'https://texty-89895.firebaseio.com/posts.json',
        contentType: "application/json",
        data: JSON.stringify(patchDoc),
        dataType: "json",
        method: "PATCH"
      
        });
    }
    
}