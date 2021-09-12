import type { NextPage } from 'next'
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head'
import Layout from '../../../components/Layout'
import BlogItemDetail from '../../../components/BlogItemDetail'
import BlogPorps from '../../../models/BlogProps'
import GetStaticPropHelper from '../../../Helpers/GetStaticPropHelper';

const CameraBlog: NextPage<BlogPorps> = (props: BlogPorps) => {
  return (
      <>  
        <Layout menus={props.menu} footer={props.footer} > 
          <Head>
            <title>My Photo Blog - Photographer</title>
            <meta name="description" content="My Photo Blog" />
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

export default CameraBlog;

export const getStaticPaths: GetStaticPaths = async () => {
    return await GetStaticPropHelper.getBlogListStaticPaths("Camera");
}
export const getStaticProps: GetStaticProps<BlogPorps> = async (context) => { // must be async
  return await GetStaticPropHelper.getBlogPageStaticProps(context);
};

