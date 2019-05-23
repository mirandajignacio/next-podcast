import "isomorphic-fetch";
import Layout from "../components/Layout";
import ChannelGrid from "../components/ChannelGrid";
import Head from "next/head";
import PodcastListWithClick from "../components/PodcastListWithClick";
import PodcastPlayer from "../components/PodcastPlayer";

import Error from "./_error";

export default class extends React.Component {
  constructor(props) {
    super();
    this.state = { openPodcast: null };
  }

  static async getInitialProps({ query, res }) {
    let idChannel = query.id;
    try {
      let [reqChannel, reqAudioClips, reqSeries] = await Promise.all([
        fetch(`https://api.audioboom.com/channels/${idChannel}`),
        fetch(`https://api.audioboom.com/channels/${idChannel}/audio_clips`),
        fetch(`https://api.audioboom.com/channels/${idChannel}/child_channels`)
      ]);

      if (reqChannel.status >= 400) {
        res.statusCode = reqChannel.status;
        return {
          channel: null,
          audioClips: null,
          series: null,
          statusCode: reqChannel.status
        };
      }
      let [dataChannel, dataAudioClips, dataSeries] = await Promise.all([
        reqChannel.json(),
        reqAudioClips.json(),
        reqSeries.json()
      ]);

      let channel = dataChannel.body.channel;
      let audioClips = dataAudioClips.body.audio_clips;
      let series = dataSeries.body.channels;

      return { channel, audioClips, series, statusCode: 200 };
    } catch (error) {
      res.statusCode = 503;
      return { channel: null, audioClips: null, series: null, statusCode: 503 };
    }
  }

  openPodcast = (event, podcast) => {
    event.preventDefault();
    this.setState({
      openPodcast: podcast
    });
  };

  closePodcast = event => {
    event.preventDefault();
    this.setState({
      openPodcast: null
    });
  };

  render() {
    const { channel, audioClips, series, statusCode } = this.props;
    const { openPodcast } = this.state;
    if (statusCode !== 200) {
      return <Error {...{ statusCode }} />;
    }
    return (
      <Layout>
        <Head>
          <title>{channel.title}</title>
        </Head>
        {openPodcast && (
          <div className="modal">
            <PodcastPlayer clip={openPodcast} onClose={this.closePodcast} />
          </div>
        )}
        <h1>{channel.title}</h1>
        {series.length > 0 ? (
          <ChannelGrid {...{ channels: series, title: "Series" }} />
        ) : null}

        {audioClips.length > 0 ? (
          <PodcastListWithClick
            podcasts={audioClips}
            title="Ultimos podcasts"
            onClickPodcast={this.openPodcast}
          />
        ) : null}

        <style jsx>{`
          h1 {
            font-weight: 600;
            padding: 15px;
          }
          h2 {
            padding: 5px;
            font-size: 0.9em;
            font-weight: 600;
            margin: 0;
            text-align: center;
          }

          .modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 99999;
          }
        `}</style>
      </Layout>
    );
  }
}
