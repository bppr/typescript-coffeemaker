import { Identifier } from "@babel/types";


interface CreatePostParams { 
  author: Author, 
  title: string, 
  body: string 
}

class Author {
  readonly id: number;
  readonly name: string;

  constructor(params: { id: number, name: string }) {
    this.id = params.id;
    this.name = params.name;
  }
}
class BlogEngine {
  createPost(params: CreatePostParams) {
    return new Post(params);
  }
}

class Post {
  readonly authorId: number;
  readonly title: string;
  readonly body: string;
  readonly id: number;

  constructor(params: CreatePostParams) {
    this.authorId = params.author.id;
    this.title = params.title;
    this.body = params.body;
  }
}

describe('BlogEngine', () => {
  it('creates a new post', ()  => {
    let engine = new BlogEngine();
    let author = new Author({ id: 1, name: 'Brian' });
  
    let post = engine.createPost({
      author: author,
      title: 'my cool post',
      body: 'its a new blog and its real nice'
    });
  });
});