import type { NextPage } from 'next'
import { GetStaticProps } from 'next';
import Head from 'next/head'
import Layout from '../../components/Layout'
import BlogList from '../../components/BlogList'
import MessageBlock from '../../components/MessageBlock'
import BlogListPorps from '../../models/BlogListPorps'
import GetStaticPropHelper from '../../Helpers/GetStaticPropHelper';

const Photography: NextPage<BlogListPorps> = (props: BlogListPorps) => {
  return (
      <>  
        <Layout menus={props.menu} footer={props.footer} > 
          <Head>
            <title>My Photo Blog - {props.pageIntro.title}</title>
            <meta name="description" content={props.pageIntro.body} />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className='container'>
            <MessageBlock
              title={props.pageIntro.title}
              body ={props.pageIntro.body} />
            <BlogList blogs={props.blogs} /> 
          </div>
        </Layout>
    </>
  )
}

export default Photography;

export const getStaticProps: GetStaticProps<BlogListPorps> = async (context) => { // must be async
  return await GetStaticPropHelper.getBlogListPageStaticProps("Photography", "Photography");
};

