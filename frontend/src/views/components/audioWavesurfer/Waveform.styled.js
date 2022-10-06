import styled from 'styled-components'

export const WaveformContianer = styled.div`
  display: flex;  
  flex-direction: row;  
  align-items: center;
  justify-content: center;
  //height: 100px;
  width: 100%;
  background: transparent;
`

export const Wave = styled.div`
  width: 100%;
  //height: 90px;
`

export const PlayButton = styled.button`
  display: inline-block;
  justify-content: center;
  align-items: center;
  margin: 15px !important;
  width: 48px;
  height: 48px;
  background: #EFEFEF;
  border-radius: 50% !important;
  border: 1px solid #7367F0;
  padding-left: 10px;
  outline: none;
  cursor: pointer;
  padding-bottom: 3px;
  /* &:hover {
    background: #DDD;
  } */
`

export const RecordingButton = styled.button`
  display: inline-block;
  justify-content: center;
  align-items: center;
  margin: 15px !important;
  width: 72px;
  height: 72px;
  background: #7367F0;
  border-radius: 50% !important;
  border: none;
  outline: none;
  cursor: pointer;
  padding-bottom: 3px;
  /* &:hover {
    background: #DDD;
  } */
`

export const PauseButton = styled.button`
  display: inline-block;
  justify-content: center;
  align-items: center;
  margin: 15px !important;
  width: 48px;
  height: 48px;
  background: #EFEFEF;
  border-radius: 50% !important;
  border: 1px solid #7367F0;
  outline: none;
  cursor: pointer;
  padding-bottom: 3px;
  /* &:hover {
    background: #DDD;
  } */
`

export const StopRecordingButton  = styled.button`
  display: inline-block;
  justify-content: center;
  align-items: center;
  margin: 15px !important;
  width: 48px;
  height: 48px;
  background: #EFEFEF;
  border-radius: 50% !important;
  border: 1px solid #7367F0;
  outline: none;
  cursor: pointer;
  padding-bottom: 3px;
  /* &:hover {
    background: #DDD;
  } */
`

export const PlayPauseConversationButton = styled.button`
  display: inline-block;
  justify-content: center;
  align-items: center;
  margin: 6px !important;
  width: 32px;
  height: 32px;
  background: #7367F0;
  border-radius: 50% !important;
  border: none;
  outline: none;
  cursor: pointer;
  padding-bottom: 3px;
`

export const ConversationAudioContainer = styled.div`
  margin-right: calc(var(--bs-gutter-x) * -0.5);
  margin-left: calc(var(--bs-gutter-x) * -0.5);
  margin-top: calc(var(--bs-gutter-y) * -1);
  --bs-gutter-x: 2rem;
  --bs-gutter-y: 0;
  min-width: 400px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background: #E8E7F7;
  border-radius: 34px 34px 34px 34px;
  padding: 12px 24px;
`

export const ConversationCurrentTimeAudio = styled.div`
  flex: 1 0;
  flex: 0 0 0%;
  padding-right: 0 !important;
  padding-left: 0 !important;
  font-size: 19px;
`