import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  Coins, Loader2, LogOut, MessageCircle, Send, Trash2, TriangleAlert, 
  UserMinus, UserRoundPlus, Users, User, Crown, BadgeCheck, ShieldCheck, 
  Plus, Smile, Info, Video, Star
} from 'lucide-react'
import useUserStore from '../store/userStore.js'
import { connectSocket, socket } from '../socket/socket.js'
import useRoomStore from '../store/roomStore.js'
import useMessageStore from '../store/messageStore.js'
import { handleError, handleSuccess } from '../components/ErrorMessage.jsx'
import useReportStore from '../store/reportStore.js'
import ReportPopup from '../components/ReportPopup.jsx'
import useRatingStore from '../store/ratingStore.js'
import RatingPopup from '../components/RatingPopup.jsx'
import Emoji from '../components/Emoji.jsx'
import playSound from '../utils/playSound.js'
import joinAnyRoomSound from '../assets/sounds/joinAnyRoom.mpeg'
import rechargeGoingToEndSound from '../assets/sounds/rechargeGoingToEnd.aac'

const MessageRoom = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { user, userRole, fetchUser } = useUserStore()
  const [messageText, setMessageText] = useState('')
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [isBoyInside, setIsBoyInside] = useState(userRole === 'boy')
  const [boyProfile, setBoyProfile] = useState(null)
  const { user: useralldata } = useUserStore();
  const [girlProfile, setGirlProfile] = useState(null)
  const [boyFollowers, setBoyFollowers] = useState(0)
  const [girlFollowers, setGirlFollowers] = useState(0)
  const [boyFollowing, setBoyFollowing] = useState(0)
  const [girlFollowing, setGirlFollowing] = useState(0)
  const [respectPoint, setRespectPoint] = useState(0);
  const [avgReating, setAvgReacting] = useState(0)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [isRatingOpen, setIsRatingOpen] = useState(false)
  const [ratingTarget, setRatingTarget] = useState(null)
  const [afterRatingAction, setAfterRatingAction] = useState(null)
  const messagesEndRef = useRef(null)
  const isSendingMessageRef = useRef(false)
  const hasPendingRatingRef = useRef(false)
  const suppressCloseRatingRef = useRef(false)
  const boyProfileRef = useRef(null)
  const girlProfileRef = useRef(null)
  const { leaveRoom, destroyRoom, getRoomDetails } = useRoomStore()
  const {
    sendMessage: sendMessageToServer,
    getMessages,
    clearMessages,
    addMessage,
    messages,
  } = useMessageStore()
  const { createReport, isLoading: isReportSubmitting } = useReportStore()
  const { createRating, checkRating, isLoading: isRatingSubmitting } = useRatingStore()

  const handleSendMessage = async () => {
    // A ref is set synchronously so a second click cannot start another
    // request before React has a chance to disable the button.
    if (!isBoyInside || isSendingMessageRef.current) return

    const trimmedMessage = messageText.trim()
    if (!trimmedMessage) return

    isSendingMessageRef.current = true
    setIsSendingMessage(true)
    try {
      await sendMessageToServer(roomId, {
        text: trimmedMessage,
        messageType: 'text',
      })
      setMessageText('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      isSendingMessageRef.current = false
      setIsSendingMessage(false)
    }
  }

  const handleEmojiSelect = async (emoji) => {
    if (!isBoyInside || isSendingMessageRef.current) return

    isSendingMessageRef.current = true
    setIsSendingMessage(true)
    try {
      await sendMessageToServer(roomId, { text: emoji, messageType: 'emoji' })
    } catch (error) {
      console.error('Error sending emoji:', error)
    } finally {
      isSendingMessageRef.current = false
      setIsSendingMessage(false)
    }
  }

  const exitRoom = useCallback(() => {
    clearMessages()
    if (roomId && user?._id) {
      socket.emit('leave_room', { roomId, userId: user._id })
    }
    navigate('/')
  }, [clearMessages, navigate, roomId, user])

  const runAfterRatingAction = useCallback(async (action) => {
    if (action === 'destroyThenExit') {
      suppressCloseRatingRef.current = true
      await destroyRoom(roomId)
      await fetchUser()
      exitRoom()
      return
    }

    if (action === 'exit') {
      suppressCloseRatingRef.current = true
      exitRoom()
    }
  }, [destroyRoom, exitRoom, fetchUser, roomId])

  const openRatingPopup = useCallback(async (targetUser, action = null) => {
    if (!targetUser?._id || hasPendingRatingRef.current) return

    if (userRole !== 'girl') {
      try {
        const hasRated = await checkRating(targetUser._id)
        if (hasRated) {
          await runAfterRatingAction(action)
          return
        }
      } catch (error) {
        console.error('Error checking rating:', error)
      }
    }

    hasPendingRatingRef.current = true
    setRatingTarget(targetUser)
    setAfterRatingAction(action)
    setIsRatingOpen(true)
  }, [checkRating, runAfterRatingAction, userRole])

  const completeRatingFlow = useCallback(async () => {
    const action = afterRatingAction

    hasPendingRatingRef.current = false
    setIsRatingOpen(false)
    setRatingTarget(null)
    setAfterRatingAction(null)

    await runAfterRatingAction(action)
  }, [afterRatingAction, runAfterRatingAction])

  const leaveRoomFunc = async () => {
    if (userRole !== 'boy' || isLeaving) return

    try {
      setIsLeaving(true)
      await leaveRoom(roomId)
      await fetchUser()
      if (girlProfile?._id) {
        await openRatingPopup(girlProfile, 'exit')
      } else {
        exitRoom()
      }
    } catch (error) {
      console.error('Error leaving room:', error)
    } finally {
      setIsLeaving(false)
    }
  }

  const destroyRoomFunc = async () => {
    if (userRole !== 'girl' || isLeaving) return

    try {
      if (boyProfile?._id) {
        await openRatingPopup(boyProfile, 'destroyThenExit')
        return
      }
      setIsLeaving(true)
      await destroyRoom(roomId)
      await fetchUser()
      exitRoom()
    } catch (error) {
      console.error('Error destroying room:', error)
    } finally {
      setIsLeaving(false)
    }
  }

  useEffect(() => {
    if (!roomId || !user?._id) return

    const joinRoom = () => {
      socket.emit('join_room', { roomId, userId: user._id })
    }

    connectSocket()
    if (socket.connected) joinRoom()
    else socket.once('connect', joinRoom)

    return () => {
      socket.off('connect', joinRoom)
      socket.emit('leave_room', { roomId, userId: user._id })
    }
  }, [roomId, user?._id])
  
  const isBoy = useMemo(() => userRole === 'boy', [userRole]);
  const isGirl = useMemo(() => userRole === 'girl', [userRole]);
  const [isFollow, setIsFollow] = useState(false)
  const [loder, setLoder] = useState(false)

  useEffect(() => {
    const fectFollowOrnot = async () => {
      if (isBoy && girlProfile) {
        try {
          const url = `${import.meta.env.VITE_BACKEND_URL}/api/follower/v1/check-follow`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profileUserId: girlProfile._id }),
            credentials: 'include',
          });
          const data = await res.json();
          if (!data.success) {
            return setIsFollow(false)
          }
          setIsFollow(true)
        } catch (error) {
        } finally {
          setLoder(false)
        }
      }
      if (isGirl && boyProfile) {
        try {
          const url = `${import.meta.env.VITE_BACKEND_URL}/api/follower/v1/check-follow`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profileUserId: boyProfile._id }),
            credentials: 'include',
          });
          const data = await res.json();
          if (!data.success) {
            return setIsFollow(false)
          }
          setIsFollow(true)
        } catch (error) {
        } finally {
          setLoder(false);
        }
      }
    }
    if (boyProfile || girlProfile) {
      fectFollowOrnot();
    }
  }, [boyProfile, girlProfile, isBoy, isGirl])

  const handleFollowClick = async () => {
    if (isBoy) {
      try {
        setLoder(true)
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/follower/v1/add-followers`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileUserId: girlProfile._id }),
          credentials: 'include',
        });
        const data = await res.json();
        if (!data.success) return setIsFollow(false)
        setIsFollow(true)
      } catch (error) {
      } finally {
        setLoder(false)
      }
    }
    if (isGirl) {
      try {
        setLoder(true)
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/follower/v1/add-followers`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileUserId: boyProfile._id }),
          credentials: 'include',
        });
        const data = await res.json();
        if (!data.success) return setIsFollow(false)
        setIsFollow(true)
      } catch (error) {
      } finally {
        setLoder(false)
      }
    }
  }

  const handleUnfollowClick = async () => {
    if (isBoy) {
      try {
        setLoder(true)
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/follower/v1/unfollow`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileUserId: girlProfile._id }),
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success) return setIsFollow(false)
        setIsFollow(true)
      } catch (error) {
        handleError('Network Issue ! Try again')
      } finally {
        setLoder(false)
      }
    }
    if (isGirl) {
      try {
        setLoder(true)
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/follower/v1/unfollow`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileUserId: boyProfile._id }),
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success) return setIsFollow(false)
        setIsFollow(true)
      } catch (error) {
        handleError('Network Issue ! Try again')
      } finally {
        setLoder(false)
      }
    }
  }

  useEffect(() => {
    if (!roomId) return

    clearMessages()

    getRoomDetails(roomId)
      .then((data) => {
        const room = data?.room
        setBoyFollowers(room?.boyExtraDetails?.followerCount || 0);
        setBoyFollowing(room?.boyExtraDetails?.followingCount || 0)
        setRespectPoint(room?.RespactPoint || 0)
        setAvgReacting(room?.AvgRating || 0)
        setGirlFollowers(room?.girlsExtraDetails?.followerCount || 0)
        setGirlFollowing(room?.girlsExtraDetails?.followingCount || 0)
        setIsBoyInside(userRole === 'boy' || Boolean(room?.currentBoy))
        boyProfileRef.current = room?.currentBoy || null
        girlProfileRef.current = room?.createdBy || null
        setBoyProfile(room?.currentBoy || null)
        setGirlProfile(room?.createdBy || null)
      })
      .catch((error) => console.error('Error loading room details:', error))

    getMessages(roomId).catch((error) => {
      console.error('Error loading messages:', error)
    })

    const handleNewMessage = (message) => {
      if (message.roomId === roomId) addMessage(message)
    }

    const handleRoomClosed = (data) => {
      if (data.roomId !== roomId) return
      fetchUser().catch(() => {})

      if (suppressCloseRatingRef.current) {
        exitRoom()
        return
      }

      const target = userRole === 'boy' ? girlProfileRef.current : boyProfileRef.current
      if (target?._id) {
        openRatingPopup(target, 'exit')
        return
      }

      exitRoom()
    }

    const handleBoyJoined = async (data) => {
      if (data.roomId !== roomId) return

      setIsBoyInside(true)
      if (userRole === 'girl') {
        playSound(joinAnyRoomSound)
        try {
          const details = await getRoomDetails(roomId)
          boyProfileRef.current = details?.room?.currentBoy || null
          setBoyProfile(details?.room?.currentBoy || null)
        } catch (error) {
          console.error('Error loading joined boy details:', error)
        }
      }
    }

    const handleBoyLeft = (data) => {
      if (data.roomId !== roomId) return
      fetchUser().catch(() => {})

      const leavingBoy = boyProfileRef.current
      setIsBoyInside(false)
      boyProfileRef.current = null
      setBoyProfile(null)
      clearMessages()

      if (userRole === 'boy' && String(data.boyId) === String(user?._id)) {
        if (data.exitReason === 'time_limit') playSound(rechargeGoingToEndSound)
        openRatingPopup(girlProfileRef.current, 'exit')
        return
      }

      if (userRole === 'girl' && leavingBoy?._id) {
        openRatingPopup(leavingBoy, null)
      }
    }

    socket.on('new_message', handleNewMessage)
    socket.on('boy_joined', handleBoyJoined)
    socket.on('room_destroyed', handleRoomClosed)
    socket.on('room_closed', handleRoomClosed)
    socket.on('boy_left', handleBoyLeft)

    return () => {
      socket.off('new_message', handleNewMessage)
      socket.off('boy_joined', handleBoyJoined)
      socket.off('room_destroyed', handleRoomClosed)
      socket.off('room_closed', handleRoomClosed)
      socket.off('boy_left', handleBoyLeft)
      clearMessages()
    }
  }, [roomId, userRole, user, fetchUser, getRoomDetails, getMessages, addMessage, clearMessages, exitRoom, openRatingPopup])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getFallbackAvatar = (name = 'User') =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF4D8D&color=fff&bold=true`

  const handleAvatarError = (event, name) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = getFallbackAvatar(name)
  }

  const handleReportSubmit = async (reason) => {
    if (!chatPartner?._id) {
      handleError('No user available to report')
      return
    }

    try {
      await createReport({
        reportedUserId: chatPartner._id,
        reason,
      })
      setIsReportOpen(false)
      handleSuccess('Report sended')
    } catch (error) {
      handleError(error?.response?.data?.message || 'Could not send report')
    }
  }

  const handleRatingSubmit = async (rating) => {
    if (!ratingTarget?._id) {
      handleError('No user available to rate')
      return
    }

    try {
      await createRating({
        ratedUserId: ratingTarget._id,
        rating,
      })
      handleSuccess('Rating sended')
      await completeRatingFlow()
    } catch (error) {
      const message = error?.response?.data?.message || 'Could not send rating'
      if (message.toLowerCase().includes('already rated')) {
        handleSuccess('Rating already sended')
        await completeRatingFlow()
        return
      }
      handleError(message)
    }
  }

  const handleRatingLater = async () => {
    if (userRole !== 'boy') return
    await completeRatingFlow()
  }

  const isOwnMessage = (message) =>
    String(message.sender?.id || message.sender?._id) === String(user?._id)

  const exitLabel = userRole === 'girl' ? 'Destroy Room' : 'Leave Room'
  const inputPlaceholder = isBoyInside ? 'Type your message...' : 'No boy is in the room yet'
  const chatPartner = userRole === 'boy' ? girlProfile : boyProfile
  const partnerName = chatPartner?.fullName || 'Guest'
  const partnerAvatar = chatPartner?.imageUrl || getFallbackAvatar(partnerName)

  return (
    <div className='min-h-screen bg-[#070b19] p-0 text-white sm:px-4 sm:py-5 font-sans'>
      <div className='mx-auto flex h-dvh w-full max-w-5xl flex-col overflow-hidden bg-[#0a0f24] shadow-2xl sm:h-[calc(100vh-2.5rem)] sm:rounded-[40px] sm:border sm:border-blue-500/20'>
        {/* Top Navbar */}
        <nav className='z-20 flex min-h-17 items-center justify-between px-4 py-4 sm:px-6'>
          <div className='flex items-center gap-3'>
            <div className='relative shrink-0'>
              <div className='rounded-full p-0.5 bg-linear-to-br from-[#FF4D8D] to-[#4D8DFF]'>
                <img
                  src={partnerAvatar}
                  alt={partnerName}
                  onError={(event) => handleAvatarError(event, partnerName)}
                  className='h-10 w-10 rounded-full border border-[#0a0f24] object-cover'
                />
              </div>
              <span className='absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0a0f24] bg-green-500' />
            </div>
            <div>
              <h1 className='flex items-center gap-1 text-sm font-bold sm:text-base'>
                {partnerName} <BadgeCheck size={14} className="text-[#4D8DFF]" />
              </h1>
              <p className='text-[11px] text-green-400'>In the room</p>
            </div>
          </div>
          
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1 rounded-3xl border border-yellow-400/20 bg-yellow-500/10 px-2 py-1 text-xs'>
              <CoinIcon className="w-3.5 h-3.5 text-yellow-400" /> {useralldata.walletBlance}
            </div>
            
            {/* The user's exact original styles for these buttons */}
            <button
              type='button'
              onClick={userRole === 'girl' ? destroyRoomFunc : leaveRoomFunc}
              disabled={isLeaving}
              className='flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm'
            >
              {userRole === 'girl' ? <Trash2 size={16} /> : <LogOut size={16} />}
              {isLeaving ? 'Please wait...' : exitLabel}
            </button>
            <button
              type='button'
              aria-label={`Report ${partnerName}`}
              onClick={() => setIsReportOpen(true)}
              className='flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm'
            >
              <TriangleAlert size={18} />
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className='flex-1 space-y-4 overflow-y-auto px-4 py-2 sm:px-6 custom-scrollbar'>
          {!isBoyInside && userRole === 'girl' ? (
            <div className='flex h-full flex-col items-center justify-center px-6 text-center'>
              <div className='mb-4 flex h-18 w-18 items-center justify-center rounded-full border border-[#FF4D8D]/20 bg-[#FF4D8D]/10 text-[#FF4D8D]'>
                <MessageCircle size={30} />
              </div>
              <h2 className='text-lg font-bold text-white'>Waiting for someone to join</h2>
              <p className='mt-2 max-w-xs text-sm leading-6 text-slate-400'>You’ll see his profile here as soon as a boy enters the room.</p>
            </div>
          ) : (
            <>
              {chatPartner && (
                <section className='mx-auto mb-8 mt-2 flex max-w-sm flex-col items-center rounded-[32px] border border-blue-500/20 bg-[#0c122b]/80 px-6 py-8 text-center shadow-[0_0_25px_rgba(77,141,255,0.05)] backdrop-blur-xl'>
                  {/* Neon Avatar */}
                  <div className='relative mb-4 rounded-full bg-linear-to-tr from-[#FF4D8D] via-purple-500 to-[#4D8DFF] p-1 shadow-[0_0_20px_rgba(255,77,141,0.4)]'>
                    <img
                      src={partnerAvatar}
                      alt={partnerName}
                      onError={(event) => handleAvatarError(event, partnerName)}
                      className='h-28 w-28 rounded-full border-4 border-[#0c122b] object-cover sm:h-32 sm:w-32'
                    />
                    <div className='absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#0c122b] bg-pink-500 p-1.5 shadow-lg'>
                      <Smile size={16} className="text-white" />
                    </div>
                  </div>

                  <h2 className='mt-2 flex items-center justify-center gap-1.5 text-2xl font-bold text-white'>
                    {partnerName} <BadgeCheck size={20} className="text-[#4D8DFF]" />
                  </h2>

                  {/* Profile Stats Matrix */}
                  <div className='mt-6 flex w-full justify-between gap-3'>
                    <div className='flex flex-1 flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 py-3 transition hover:bg-white/10'>
                      <Users size={20} className="mb-1 text-[#FF4D8D]" />
                      <span className='text-base font-bold text-white'>{isBoy ? girlFollowers : boyFollowers}</span>
                      <span className='text-[10px] uppercase tracking-wider text-slate-400'>Followers</span>
                    </div>
                    <div className='flex flex-1 flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 py-3 transition hover:bg-white/10'>
                      <User size={20} className="mb-1 text-[#4D8DFF]" />
                      <span className='text-base font-bold text-white'>{isBoy ? girlFollowing : boyFollowing}</span>
                      <span className='text-[10px] uppercase tracking-wider text-slate-400'>Following</span>
                    </div>
                    <div className='flex flex-1 flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 py-3 transition hover:bg-white/10'>
                      <Crown size={20} className="mb-1 text-yellow-500" />
                      <span className='text-base font-bold text-yellow-400'>{isBoy?avgReating:respectPoint}</span>
                      <span className='text-[10px] uppercase tracking-wider text-slate-400'>{isBoy?"Rating":"Respect"}</span>
                    </div>
                  </div>

                  {/* Follow & Message Buttons */}
                  <div className='mt-5 flex w-full gap-3'>
                    <button
                      onClick={loder ? undefined : (isFollow ? handleUnfollowClick : handleFollowClick)}
                      disabled={loder}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#FF4D8D] to-purple-600 py-3 text-sm font-semibold text-white shadow-[0_0_15px_rgba(255,77,141,0.3)] transition-all hover:scale-[1.02] active:scale-95 ${loder ? 'cursor-not-allowed opacity-70' : ''}`}
                    >
                      {loder ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>
                          {isFollow ? <UserMinus size={18} /> : <Plus size={18} />}
                          {isFollow ? 'Unfollow' : 'Follow'}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Badges/Info row */}
                  
                  <div className='mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 py-2.5 text-xs font-medium text-purple-300'>
                    <ShieldCheck size={16} /> Verified & Trusted Member
                  </div>
                </section>
              )}

              {/* Chat Date Divider */}
              <div className='relative flex items-center justify-center py-4'>
                <div className='absolute left-0 right-0 h-[1px] bg-linear-to-r from-transparent via-white/10 to-transparent' />
                <span className='relative bg-[#0a0f24] px-4 text-xs font-medium text-slate-400'>
                  ✧ Today ✧
                </span>
              </div>

              {/* Messages Container */}
              <div className='space-y-4 pb-4'>
                {messages.length === 0 ? (
                  <p className='text-center text-xs text-slate-500'>No messages yet. Say hello!</p>
                ) : messages.map((message, index) => {
                  const ownMessage = isOwnMessage(message)
                  const isEmojiMessage = message.messageType === 'emoji'
                  const messageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // Format as needed based on your message object

                  return (
                    <div key={message._id || index} className={`flex items-end gap-2 ${ownMessage ? 'justify-end' : 'justify-start'}`}>
                      {!ownMessage && (
                        <div className="rounded-full p-[1px] bg-linear-to-tr from-[#FF4D8D] to-[#4D8DFF] mb-1">
                          <img
                            src={partnerAvatar}
                            alt={partnerName}
                            onError={(event) => handleAvatarError(event, partnerName)}
                            className='h-7 w-7 rounded-full border border-[#0a0f24] object-cover'
                          />
                        </div>
                      )}
                      
                      <div className={`relative ${isEmojiMessage ? 'px-2 py-1' : 'max-w-[75%] px-4 py-3 text-sm shadow-md sm:max-w-[65%]'} ${
                        ownMessage 
                          ? isEmojiMessage ? '' : 'rounded-3xl rounded-br-sm bg-linear-to-r from-[#FF4D8D] to-purple-500 text-white shadow-[0_4px_15px_rgba(255,77,141,0.15)]'
                          : isEmojiMessage ? '' : 'rounded-3xl rounded-bl-sm border border-blue-500/20 bg-[#121936] text-slate-200'
                        }`}
                      >
                        <p className={isEmojiMessage ? 'pr-8 text-6xl leading-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]' : 'pr-12'}>
                          {['text', 'emoji'].includes(message.messageType) ? message.text : message.fileUrl}
                        </p>
                        
                        <div className="absolute bottom-1.5 right-3 flex items-center gap-1">
                          <span className={`text-[9px] ${ownMessage ? 'text-white/80' : 'text-slate-400'}`}>
                            {messageTime}
                          </span>
                          {ownMessage && <BadgeCheck size={10} className="text-white/90" />}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            </>
          )}
        </main>

        {/* Chat Input Footer */}
        <footer className='bg-[#0a0f24] px-4 py-3 sm:px-6'>
          <div className={`flex items-center gap-2 rounded-full border p-1.5 transition-all ${
            isBoyInside 
              ? 'border-[#FF4D8D]/40 bg-[#121936] shadow-[0_0_15px_rgba(255,77,141,0.05)] focus-within:border-[#FF4D8D]' 
              : 'border-white/5 bg-white/5 opacity-60'
            }`}
          >
            <Emoji onSelect={handleEmojiSelect} />
            
            <input
              type='text'
              value={messageText}
              placeholder={inputPlaceholder}
              disabled={!isBoyInside || isSendingMessage}
              className='min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed'
              onChange={(event) => setMessageText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            
            
            
            <button
              type='button'
              aria-label='Send message'
              onClick={handleSendMessage}
              disabled={!isBoyInside || !messageText.trim() || isSendingMessage}
              className='flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-linear-to-r from-[#FF4D8D] to-purple-500 text-white shadow-lg transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100'
            >
              {isSendingMessage ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
            </button>
          </div>
          {!isBoyInside && userRole === 'girl' && (
            <p className='mt-2 text-center text-[10px] uppercase tracking-wider text-slate-500'>Messaging will unlock when a boy joins.</p>
          )}
        </footer>
      </div>
      
      <ReportPopup
        isOpen={isReportOpen}
        userName={partnerName}
        onClose={() => setIsReportOpen(false)}
        onSubmit={handleReportSubmit}
        isSubmitting={isReportSubmitting}
      />
      <RatingPopup
        isOpen={isRatingOpen}
        userName={ratingTarget?.fullName || 'Guest'}
        userImage={ratingTarget?.imageUrl || getFallbackAvatar(ratingTarget?.fullName || 'Guest')}
        canSkip={userRole === 'boy'}
        onSkip={handleRatingLater}
        onSubmit={handleRatingSubmit}
        isSubmitting={isRatingSubmitting}
      />
    </div>
  )
}

function CoinIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="12" r="10" fill="#facc15" />
      <circle cx="12" cy="12" r="8" fill="#eab308" />
      <path d="M12 6V18M9 9H15M9 15H15" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default MessageRoom
