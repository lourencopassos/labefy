import React, { Component } from "react";
import axios from "axios";
import styled from "styled-components";

const DeletePlaylistButton = styled.span`
  color: red;
  cursor: pointer;
`;

const PlaylistName = styled.p`
  cursor: pointer;
`;

const CreatePlaylistButton = styled.button`
margin-top: 20px;
` 
const CentralizedDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Option = styled.option``;

let trackToPlaylistId;

class Playlists extends Component {
  state = {
    playlistName: "",
    playlists: [],
    playlistsTracks: [],
    trackName: "",
    artistName: "",
    urlTrack: "",
    playlistRender: false,
  };

  componentWillMount = () => {
    this.fetchPlaylistName();
  };

  addMusicToPlaylist = (id) => {
    const body = {
      name: this.state.trackName,
      artist: this.state.artistName,
      url: this.state.urlTrack,
    };
    axios
      .post(
        `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${id}/tracks`,
        body,
        {
          headers: {
            Authorization: "lourenco-passos-mello",
          },
        }
      )
      .then((response) => {
        console.log(response);
        alert("Música adicionada com sucesso!");
        this.setState({ trackName: "" });
        this.setState({ artistName: "" });
        this.setState({ urlTrack: "" });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onChangePlaylistSelect = (event) => {
    trackToPlaylistId = event.target.value;
  };

  onChangeTrackName = (event) => {
    this.setState({ trackName: event.target.value });
  };

  onChangeArtistName = (event) => {
    this.setState({ artistName: event.target.value });
  };

  onChangeUrlTrack = (event) => {
    this.setState({ urlTrack: event.target.value });
  };

  fetchPlaylistTracks = (id) => {
    axios
      .get(
        `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${id}/tracks`,
        {
          headers: {
            Authorization: "lourenco-passos-mello",
          },
        }
      )
      .then((response) => {
        console.log(response.data.result.tracks);
        this.setState({ playlistsTracks: response.data.result.tracks });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  deletePlaylist = (id) => {
    axios
      .delete(
        `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${id}`,
        {
          headers: {
            Authorization: "lourenco-passos-mello",
          },
        }
      )
      .then((response) => {
        alert("Playlist deletada com sucesso!");
        this.fetchPlaylistName();
      })
      .catch((error) => {
        alert("Erro! Verifique console!");
        console.log(error);
      });
  };

  onChangePlaylistName = (event) => {
    this.setState({ playlistName: event.target.value });
  };

  handlePlaylistRender = () => {
    this.setState({ playlistRender: !this.state.playlistRender });
  };

  fetchPlaylistName = (id) => {
    axios
      .get(
        "https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists",
        {
          headers: {
            Authorization: "lourenco-passos-mello",
          },
        }
      )
      .then((response) => {
        this.setState({ playlists: response.data.result.list });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  createPlaylist = () => {
    const body = {
      name: this.state.playlistName,
    };
    console.log(this.state.playlistName);
    axios
      .post(
        "https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists",
        body,
        {
          headers: {
            Authorization: "lourenco-passos-mello",
          },
        }
      )
      .then((response) => {
        //this.setState({ playlistName: "" });
        //this.setState({ playlists: response.data.result.list });
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const playlists = this.state.playlistRender ? (
      <div>
        {this.state.playlists.map((playlist) => {
          return (
            <CentralizedDiv>
              <PlaylistName
                onClick={() => this.fetchPlaylistTracks(playlist.id)}
              >
                {playlist.name}{" "}
                <DeletePlaylistButton
                  onClick={() => this.deletePlaylist(playlist.id)}
                >
                  X
                </DeletePlaylistButton>
              </PlaylistName>
            </CentralizedDiv>
          );
        })}
        <div>
          {this.state.playlistsTracks.map((track) => {
            return (
              <div>
                <p>
                  {track.name} - {track.artist} -{" "}
                </p>
                <iframe
                  src={track.url}
                  width="300"
                  height="380"
                  frameborder="0"
                  allowtransparency="true"
                  allow="encrypted-media"
                  title="teste"
                ></iframe>
              </div>
            );
          })}
        </div>
        <button onClick={this.handlePlaylistRender}>Ocultar Playlists</button>
      </div>
    ) : (
      <CentralizedDiv>
        <h1>Conferir Playlists</h1>{" "}
        <button onClick={this.handlePlaylistRender}>Ver Playlists</button>
      </CentralizedDiv>
    );

    return (
      <div>
        <CentralizedDiv>
          <h1>Criar Playlist!</h1>
          <input
            placeholder="Digite o nome da sua playlist"
            onChange={this.onChangePlaylistName}
            value={this.state.playlistName}
          ></input>
          <CreatePlaylistButton onClick={this.createPlaylist}>Criar Playlist</CreatePlaylistButton>
          <hr></hr>
          {playlists}
          <div></div>
 
        </CentralizedDiv>
        <CentralizedDiv>
          <h1>Adicionar Música a Playlist</h1>
          <div>
            <input
              placeholder="Qual o nome da música?"
              value={this.state.trackName}
              onChange={this.onChangeTrackName}
            ></input>
            <input
              placeholder="Quais são os artistas?"
              value={this.state.artistName}
              onChange={this.onChangeArtistName}
            ></input>
            <input
              placeholder="Qual o link da música?"
              value={this.state.urlTrack}
              onChange={this.onChangeUrlTrack}
            ></input>
            <select onChange={this.onChangePlaylistSelect}>
              <option value="" />
              {this.state.playlists.map((playlist) => {
                return <Option value={playlist.id}>{playlist.name}</Option>;
              })}
            </select>
            <button onClick={() => this.addMusicToPlaylist(trackToPlaylistId)}>
              Adiciona música
            </button>
          </div>
        </CentralizedDiv>
      </div>
    );
  }
}

export default Playlists;
