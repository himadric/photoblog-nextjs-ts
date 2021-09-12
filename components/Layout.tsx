import MainNavigation from './MainNavigation'
import Footer from './Footer'
import classes from './Layout.module.scss'
import LayoutModel from '../models/LayoutModel'

export default function Layout(props: LayoutModel & { children?: React.ReactNode }) {
    return (
        <>
            <MainNavigation menus={props.menus}/>
            <main className={classes.main}>{props.children}</main>
            <Footer {...props.footer} />
        </>
    )
}