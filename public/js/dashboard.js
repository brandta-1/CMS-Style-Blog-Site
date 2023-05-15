//send new post data to back-end
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
            alert("failed to create post");
        } else {
            location.reload();
        }
    }
};

//send delete request to back-end
const delHandler = async (event) => {

    let objType = $(event.target).parent().attr('id');

    const id = event.target.attributes[1].value;

    const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({ objType }),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!res.ok) {
        alert("failed to delete");
    } else {
        location.reload();
    }
};

//send update request to back-end
const upHandler = async (event) => {
    event.preventDefault();

    //determine if the request is for a post or a comment
    const objType = $(event.target).attr("id");
    const id = $(event.target).attr("name");
    const content = document.getElementById(`${objType} ${id}`).value;

    const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ objType, content }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        alert("failed to update");
    } else {
        location.reload();
    }
}

//add a comment to a post
const commentHandler = async (event) => {
    event.preventDefault();

    const content = $('#comment-content').val();
    const id = $(event.target).attr("id");

    const res = await fetch(`/api/comments/${id}`, {
        method: 'POST',
        body: JSON.stringify({ content }),
        headers: {
            'Content-Type': 'application/json',
        }
    })

    if (!res.ok) {
        alert("failed to upload comment");
    } else {
        location.reload();
    }
}

$('.post-form').on('submit', formHandler);

$('.comment-form').on('submit', commentHandler);

$('.up-form').on('submit', upHandler)

$('.del-btn').on("click", delHandler);

$('.up-btn').on("click", (event) => {
    $(event.target).prev().css("display", "block");
    $(event.target).next().next().css('display', 'inline');
});

$('.can-btn').on('click', (event) => {
    $(event.target).prev().prev().prev().css("display", "none");
    $('.can-btn').css('display', 'none');
})