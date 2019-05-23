import Link from "next/link";
import Head from "next/head";
import NProgress from "nprogress";
import Router from "next/router";

Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

export default class Layout extends React.Component {
  render() {
    const { children, title } = this.props;
    return (
      <div>
        <Head>
          <title>{title || "Podcasts"}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <header>
          <Link href="/" prefetch>
            <a>Podcast</a>
          </Link>
        </header>
        {children}
        <style jsx>
          {`
            header {
              color: #fff;
              background: #8756ca;
              padding: 15px;
              text-align: center;
            }
            header a {
              color: #fff;
              text-decoration: none;
            }
          `}
        </style>
        <style jsx global>
          {`
            body {
              margin: 0;
              font-family: system-ui;
              background: #f2f2f2;
            }
            /* Make clicks pass-through */
            #nprogress {
              pointer-events: none;
            }

            #nprogress .bar {
              background: #29d;

              position: fixed;
              z-index: 1031;
              top: 0;
              left: 0;

              width: 100%;
              height: 2px;
            }

            /* Fancy blur effect */
            #nprogress .peg {
              display: block;
              position: absolute;
              right: 0px;
              width: 100px;
              height: 100%;
              box-shadow: 0 0 10px #29d, 0 0 5px #29d;
              opacity: 1;

              -webkit-transform: rotate(3deg) translate(0px, -4px);
              -ms-transform: rotate(3deg) translate(0px, -4px);
              transform: rotate(3deg) translate(0px, -4px);
            }

            .nprogress-custom-parent {
              overflow: hidden;
              position: relative;
            }

            .nprogress-custom-parent #nprogress .bar {
              position: absolute;
            }
          `}
        </style>
      </div>
    );
  }
}
