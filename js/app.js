$(()=>{
    $("#login").on("click",()=>{
        event.preventDefault();
        console.log("inside on click");
        console.log($("#inputEmail").val());
        console.log($("#inputPassword").val());
        if(($("#inputEmail").val()=="kavyasarangan@gmail.com") && ($("#inputPassword").val()=="1234")){
            window.location.href = "todo.html"
        }
    });

    $("#addTask").on("click",()=>{
        event.preventDefault();
        console.log("inside add Task");
        //add task to firebase

        //render the pending tasks to To Do Items
    });
});