import type { NextPage } from 'next'
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head'
import Layout from '../../../components/Layout'
import BlogItemDetail from '../../../components/BlogItemDetail'
import BlogProps from '../../../models/BlogProps'
import GetStaticPropHelper from '../../../Helpers/GetStaticPropHelper';

const PhotographerBlog: NextPage<BlogProps> = (props: BlogProps) => {
  return (
      <>  
        <Layout menus={props.menu} footer={props.footer} > 
          <Head>
          <title>My Photo Blog - {props.blog.title}</title>
            <meta name="description" content={props.blog.shortDescription} />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className='container'>
                  <BlogItemDetail 
                    id = {props.blog.id}
                    collectionName={props.blog.collectionName}
                    publishDate={props.blog.publishDate}
                    readtime={props.blog.readtime}
                    image={props.blog.image}
                    imageAlt={props.blog.imageAlt}
                    title={props.blog.title}
                    shortDescription={props.blog.shortDescription}
                    body={props.blog.body}
                    link={props.blog.link}
                    noOfViews={props.blog.noOfViews}
                    noOfComments={props.blog.noOfComments}
                    noOfFavorites={props.blog.noOfFavorites}
                  />
                </div>
        </Layout>
    </>
  )
}

export default PhotographerBlog;

export const getStaticPaths: GetStaticPaths = async () => {
    return await GetStaticPropHelper.getBlogListStaticPaths("Photographer");
}
export const getStaticProps: GetStaticProps<BlogProps> = async (context) => { // must be async
  return await GetStaticPropHelper.getBlogPageStaticProps(context);
};

