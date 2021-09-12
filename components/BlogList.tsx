import BlogItem from './BlogItem';
import classes from './BlogList.module.scss';
import Blog from '../models/Blog';

export default function BlogList(props: {blogs: Blog[]}) {
    return (
        <section className={classes.bloglist}>
                {props.blogs.map((blogitem) => (
                <BlogItem
                    key={blogitem.id}
                    id={blogitem.id}
                    publishDate={blogitem.publishDate}
                    readtime={blogitem.readtime}
                    image={blogitem.image}
                    imageAlt={blogitem.imageAlt}
                    link={blogitem.link}
                    title={blogitem.title}
                    body={blogitem.body}
                    shortDescription={blogitem.shortDescription}
                    noOfViews={blogitem.noOfViews}
                    noOfComments={blogitem.noOfComments}
                    noOfFavorites={blogitem.noOfFavorites}
                />
            ))}
        </section>
    )
}