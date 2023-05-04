
const formHandler = async (event) => {
    event.preventDefault();

    const title = $('#post-title').val();
    const content = $('#post-content').val();

    if (title && content) {
        const res = await fetch(` /api/posts`, {
            method: 'POST',
            body: JSON.stringify({ title, content }),


            headers: {
                'Content-Type': 'application/json',
            }

        });

        if (!res.ok) {
            console.log("failed to create project")
        }
    }
};

const delHandler = async (event) => {

    let objType = $(event.target).parent().attr('id');

    const id = event.target.attributes[1].value;

    console.log(id);
    console.log(objType);

    const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({ objType }),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    console.log(res.body);
    if (!res.ok) {
        console.log("failed to delete project")
    }

};

const upHandler = async (event) => {
    event.preventDefault();

    const objType = $(event.target).attr("id");
    const id = $(event.target).attr("name");
    const content = document.getElementById(`${objType} ${id}`).value;

    console.log(id);


    //just render the partial with div display none
    
    const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({objType, content}),
        headers: {
                'Content-Type': 'application/json',
            }
    });

    console.log(res.body);
    if (!res.ok) {
        console.log("failed to delete project")
    }
    
    
    $('#up-content').val();
}

const commentHandler = async (event) => {
    event.preventDefault();
   
    const content = $('#comment-content').val();
    const id = $(event.target).attr("id");

    const res = await fetch(`/api/comments/${id}`, {
        method: 'POST',
        body: JSON.stringify({content}),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    
    console.log(res.body);
    if (!res.ok) {
        console.log("failed to upload comment")
    }
}

$('.post-form').on('submit', formHandler);

$('.comment-form').on('submit', commentHandler);

$('.up-form').on('submit', upHandler)

$('.del-btn').on("click", delHandler);

$('.up-btn').on("click", (event) => {
    $(event.target).prev().css("display", "block");
});
