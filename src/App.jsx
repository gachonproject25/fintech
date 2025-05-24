import React, { useState, useEffect, useRef } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import logoImage from './assets/logo.png';

const primaryColor = '#7bc293';
const secondaryColor = '#e6f2eb';
const textColor = '#333333';
const lightTextColor = '#666666';
const borderColor = '#cccccc';
const successColor = '#4CAF50';
const dangerColor = '#f44336';

export default function App() {
  const [step, setStep] = useState('welcome');
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [dues, setDues] = useState({});
  const dropdownRef = useRef(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [hasDuesPopupShown, setHasDuesPopupShown] = useState(false);

  // 커뮤니티 게시판 관련 상태 변수
  const [posts, setPosts] = useState([
    { id: 1, title: '첫 번째 게시글입니다!', author: '이종협', date: '2025-05-20', content: '안녕하세요, 우리 동아리 첫 게시글입니다. 앞으로 활발한 소통 기대합니다!', comments: [] },
    { id: 2, title: '동아리 MT 공지', author: '강인식', date: '2025-05-22', content: '다음 달 셋째 주 주말에 MT를 계획하고 있습니다. 많은 참여 부탁드립니다.', comments: [] },
    { id: 3, title: '새로운 아이디어 공유해요!', author: '조계윤', date: '2025-05-24', content: '동아리 활동에 대한 새로운 아이디어가 있다면 자유롭게 공유해주세요.', comments: [] },
  ]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showWriteForm, setShowWriteForm] = useState(false);

  // **** 새로운 상태 변수 추가 ****
  const [activeMemberTab, setActiveMemberTab] = useState('dashboard'); // 'dashboard', 'community'
  const [activeCommunityTab, setActiveCommunityTab] = useState('feed'); // 'feed', 'board'

  const [feedPosts, setFeedPosts] = useState([
    { id: 1, image: '/images/club_activity1.jpg', caption: '즐거운 동아리 활동 시간!', likes: 15, liked: false, comments: [{ author: '이종협', text: '재미있었어요!' }] },
    { id: 2, image: '/images/club_activity2.jpg', caption: '새로운 아이디어 회의 중!', likes: 22, liked: false, comments: [] },
    { id: 3, image: '/images/club_activity3.jpg', caption: '벚꽃 구경~', likes: 10, liked: false, comments: [] },
    { id: 4, image: '/images/club_activity4.jpg', caption: '다같이 야유회!', likes: 30, liked: false, comments: [] },
  ]);
  // ******************************

  const [loggedInMemberId, setLoggedInMemberId] = useState(4); // 예시: 4번 이종협 회원이 로그인했다고 가정

  // popupMessage 자동 숨김 타이머
  useEffect(() => {
    if (popupMessage) {
      const timer = setTimeout(() => setPopupMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [popupMessage]);

  const handleNotify = (memberName) => {
    setPopupMessage(`${memberName}님 회비 미납 알림을 전송했습니다.`);
  };

  const updateDues = (memberId, date, value) => {
    setDues(prev => {
      const key = `${memberId}-${date}`;
      return {
        ...prev,
        [key]: Number(value) || 0,
      };
    });
  };

  const handleWelcomeSignIn = () => {
    setStep('login');
  };

  const handleSignUpClick = () => {
    setStep('signup');
  };

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const groups = ['볼링 동아리', '음악 동아리', '연극 동아리'];

  const members = [
    { id: 1, name: '조계윤', department: '금융수학과', studentId: '202131943', phone: '010-1111-1111', resume: '성실한 태도로 프로젝트에 임하며 다양한 웹 프로젝트 경험 보유.' },
    { id: 2, name: '강인식', department: '금융수학과', studentId: '202131903', phone: '010-2222-2222', resume: '동아리 회장을 맡아 리더십을 발휘하였고 다양한 행사 기획 경험이 있음.' },
    { id: 3, name: '김현승', department: '금융수학과', studentId: '202031521', phone: '010-3333-3333', resume: '앱 개발에 관심이 많으며 UX/UI 디자인 능력도 뛰어남.' },
    { id: 4, name: '이종협', department: '금융수학과', studentId: '202432938', phone: '010-4444-4444', resume: '새로운 기술 학습에 열정적이며 팀 프로젝트 기여도가 높음.' },
  ];

  const dates = ['2024-05-01', '2024-05-08', '2024-05-15']; // 예시 날짜
  const latestDate = dates[dates.length - 1]; // 가장 최근 날짜 (2024-05-15)

  // 동아리 회비 거래 내역 (회원 이름과 금액 포함)
  const paymentHistory = [
    { name: '조계윤', amount: 30000 },
    { name: '강인식', amount: 60000 },
    { name: '김현승', amount: 90000 },
    { name: '동아리 회식', amount: -50000, type: 'expense' },
  ];

  const totalBalance = paymentHistory.reduce((sum, record) => sum + record.amount, 0);

  // 관리자 모드에서 출석 토글 (수정 없음)
  const toggleAttendance = (memberId, date) => {
    setAttendance(prev => {
      const key = `${memberId}-${date}`;
      const updated = { ...prev, [key]: !prev[key] };
      return updated;
    });
  };

  // 회비 기준 금액 (회원 ID별)
  const baseAmounts = {
    1: 10000,
    2: 20000,
    3: 30000,
    4: 0, // 이종협(ID:4)의 기본 회비는 0원
  };

  // 팝업 메시지를 위한 회비 미납 상태 판단 함수
  const isDuesUnpaid = (memberId) => {
    const key = `${memberId}-${latestDate}`;
    // 현재 로그인된 회원의 가장 최근 날짜 회비가 0원인지 확인
    return dues[key] === 0;
  };

  // **** 초기 dues 및 attendance 상태 설정 useEffect 훅 ****
  useEffect(() => {
    // dues 초기화 로직
    const initialDues = {};
    members.forEach(member => {
      dates.forEach(date => {
        const key = `${member.id}-${date}`;
        // loggedInMemberId (4번 이종협)의 가장 최근 날짜 회비를 0원으로 설정
        // 다른 회원이거나 다른 날짜는 baseAmounts를 따르도록 설정
        if (member.id === loggedInMemberId && date === latestDate) {
          initialDues[key] = 0; // 이종협(id:4)의 2024-05-15 회비는 0원 (미납 테스트용)
        } else {
          initialDues[key] = baseAmounts[member.id] || 0;
        }
      });
    });
    setDues(initialDues); // dues 상태 업데이트

    // attendance 초기화 로직 (1일차, 2일차는 O, 3일차는 X)
    const initialAttendance = {};
    members.forEach(member => {
      dates.forEach(date => {
        const dateIndex = dates.indexOf(date);
        if (dateIndex === 0 || dateIndex === 1) { // 1일차(index 0) 또는 2일차(index 1)
          initialAttendance[`${member.id}-${date}`] = true; // O로 설정
        } else if (dateIndex === 2) { // 3일차(index 2)
          initialAttendance[`${member.id}-${date}`] = false; // X로 설정
        } else {
          initialAttendance[`${member.id}-${date}`] = false; // 기본적으로 X
        }
      });
    });
    setAttendance(initialAttendance);
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // **** '나의 회비 현황' 진입 시 미납 팝업 띄우는 useEffect 훅 (수정된 부분) ****
  useEffect(() => {
    if (step === 'memberDues' && loggedInMemberId && isDuesUnpaid(loggedInMemberId) && !hasDuesPopupShown) {
      setPopupMessage("회비 미납 상태입니다. 회비를 납부해 주세요!");
      setHasDuesPopupShown(true);
    }
  }, [step, loggedInMemberId, dues, latestDate, hasDuesPopupShown]); // isDuesUnpaid를 의존성 배열에서 제거

  // 회원 출석 체크 버튼 핸들러
  const handleMemberAttendanceCheck = () => {
    const memberId = loggedInMemberId;
    const date = latestDate; // 가장 최근 날짜
    const key = `${memberId}-${date}`;

    setAttendance(prev => {
      setPopupMessage("출석되었습니다!"); // 팝업 메시지 설정
      return {
        ...prev,
        [key]: true, // 'O'로 변경
      };
    });
  };


  // 커뮤니티 게시판 관련 핸들러 함수
  const handleWritePost = () => {
    setStep('writePost');
    setShowWriteForm(true);
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.postTitle.value;
    const content = form.postContent.value;

    if (!title || !content) {
      setPopupMessage('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const newPost = {
      id: posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1,
      title,
      content,
      author: currentMember ? currentMember.name : '익명',
      date: new Date().toISOString().slice(0, 10),
      comments: [],
    };

    setPosts(prev => [newPost, ...prev]);
    form.reset();
    setShowWriteForm(false);
    setStep('memberDashboard'); // 커뮤니티 목록으로 돌아가도록
    setActiveCommunityTab('board'); // 게시판 탭으로 유지
    setPopupMessage('게시글이 성공적으로 작성되었습니다!');
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setStep('viewPost');
  };

  const handleCommentSubmit = (e, postId) => {
    e.preventDefault();
    const commentContent = e.target.commentContent.value;
    if (!commentContent) {
      setPopupMessage('댓글 내용을 입력해주세요.');
      return;
    }

    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                { id: post.comments.length ? Math.max(...post.comments.map(c => c.id)) + 1 : 1, author: currentMember ? currentMember.name : '익명', content: commentContent, date: new Date().toLocaleString() }
              ]
            }
          : post
      )
    );
    e.target.reset();
    setPopupMessage('댓글이 작성되었습니다.');
  };

  // **** 새로운 핸들러 함수 추가: 피드 좋아요 토글 ****
  const handleLikeToggle = (postId) => {
    setFeedPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };
  // **********************************************


  const outerContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  };

  const innerContainerStyle = {
    width: '100vw',
    maxWidth: 420,
    height: '90vh',
    border: `1px solid ${borderColor}`,
    borderRadius: 20,
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
    padding: 20,
    boxSizing: 'border-box',
    overflow: 'hidden', // 내부 스크롤을 위해 overflowY만 auto로 설정할 예정
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  };

  const commonButtonStyle = {
    padding: '12px 20px',
    fontSize: 16,
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    width: '100%',
    boxSizing: 'border-box',
  };

  const primaryButtonStyle = {
    ...commonButtonStyle,
    backgroundColor: primaryColor,
    color: 'white',
    fontWeight: 'bold',
  };

  const secondaryButtonStyle = {
    ...commonButtonStyle,
    backgroundColor: secondaryColor,
    color: textColor,
    border: `1px solid ${borderColor}`,
  };

  const inputStyle = {
    width: '80%',
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    border: `1px solid ${borderColor}`,
    boxSizing: 'border-box',
    marginBottom: 15,
    outline: 'none',
    transition: 'border-color 0.3s ease',
  };

  const goBack = () => {
    if (step === 'roleSelect') setStep('login');
    else if (step === 'adminGroupSelect') setStep('roleSelect');
    else if (step === 'adminDashboard') setStep('adminGroupSelect');
    // 관리자 기능에서 뒤로가기
    else if (step === 'memberList' || step === 'attendanceCheck' || step === 'feeManagement') setStep('adminDashboard');
    // 회원 가입에서 뒤로가기
    else if (step === 'signup') setStep('welcome');
    // 회원 기능에서 뒤로가기 (상위 탭 상태에 따라 다름)
    else if (step === 'memberGroupSelect') setStep('roleSelect');
    // **** 수정된 부분: memberDashboard 및 communityTabs 내부에서 뒤로가기 ****
    else if (step === 'memberDashboard') {
      if (activeMemberTab === 'dashboard') {
        setStep('memberGroupSelect');
      } else if (activeMemberTab === 'community') {
        if (activeCommunityTab === 'feed' || activeCommunityTab === 'board') {
          setActiveMemberTab('dashboard'); // 커뮤니티 탭에서 대시보드 탭으로 돌아가기
          setActiveCommunityTab('feed'); // 커뮤니티 탭 상태 초기화
        }
      }
    }
    else if (step === 'memberAttendance' || step === 'memberDues' || step === 'memberInfo' || step === 'accountStatement') setStep('memberDashboard');
    else if (step === 'viewPost') {
      setSelectedPost(null);
      setStep('memberDashboard'); // 게시글 상세에서 커뮤니티 목록으로 (탭 유지)
      setActiveCommunityTab('board'); // 게시판 탭으로 유지
    }
    else if (step === 'writePost') {
      setShowWriteForm(false);
      setStep('memberDashboard'); // 글 작성 폼에서 커뮤니티 목록으로 (탭 유지)
      setActiveCommunityTab('board'); // 게시판 탭으로 유지
    }
    // *********************************************************************
    // 이력서 보기 팝업 닫기
    else if (step === 'resumeView') setSelectedResume(null);
  };

  const handleLogin = () => {
    if (id && pw) {
      setStep('roleSelect');
    } else {
      alert('아이디와 비밀번호를 입력하세요.');
    }
  };

  const currentMember = members.find(member => member.id === loggedInMemberId);

  return (
    <div style={outerContainerStyle}>
      <div style={innerContainerStyle}>

        {step === 'welcome' && (
          <WelcomeScreen
            onSignInClick={handleWelcomeSignIn}
            onSignUpClick={handleSignUpClick}
            logo={logoImage}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            textColor={textColor}
          />
        )}

        {/* 뒤로가기 버튼은 memberDashboard나 커뮤니티 내부 탭 화면에서는 숨깁니다. */}
        {step !== 'welcome' && step !== 'login'  && (
          <button
            onClick={goBack}
            style={{
              ...secondaryButtonStyle,
              position: 'absolute',
              top: 20,
              left: 20,
              padding: '8px 12px',
              fontSize: 14,
              border: 'none',
              backgroundColor: 'transparent',
              color: lightTextColor,
              fontWeight: 'normal',
              width: 'auto',
              boxShadow: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
            onMouseOver={(e) => e.currentTarget.style.color = primaryColor}
            onMouseOut={(e) => e.currentTarget.style.color = lightTextColor}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="currentColor">
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
            </svg>
            뒤로가기
          </button>
        )}

        {step === 'login' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}>
            <h2 style={{ color: textColor, marginBottom: 30 }}>로그인</h2>
            <input
              type="text"
              placeholder="아이디"
              value={id}
              onChange={e => setId(e.target.value)}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = primaryColor}
              onBlur={(e) => e.target.style.borderColor = borderColor}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={pw}
              onChange={e => setPw(e.target.value)}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = primaryColor}
              onBlur={(e) => e.target.style.borderColor = borderColor}
            />
            <button
              onClick={handleLogin}
              style={{ ...primaryButtonStyle, width: '80%', marginTop: 10 }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6ab182'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryColor}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              로그인
            </button>
          </div>
        )}

        {step === 'signup' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}>
            <h2 style={{ color: textColor, marginBottom: 20 }}>회원가입</h2>
            <p style={{ color: lightTextColor, marginBottom: 30 }}>회원가입 기능은 아직 준비 중입니다.</p>
            <button
              onClick={goBack}
              style={{ ...secondaryButtonStyle, width: '80%' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f2f2f2'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = secondaryColor}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              뒤로가기
            </button>
          </div>
        )}

        {step === 'roleSelect' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: 40, color: textColor }}>
              모드를 선택하세요!
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              width: '80%',
            }}>
              <button
                onClick={() => setStep('adminGroupSelect')}
                style={primaryButtonStyle}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6ab182'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                관리자 모드
              </button>
              <button
                onClick={() => setStep('memberGroupSelect')}
                style={secondaryButtonStyle}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f2f2f2'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = secondaryColor}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                회원 모드
              </button>
            </div>
          </div>
        )}

        {step === 'adminGroupSelect' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: 30, color: textColor }}>당신의 동아리를 선택하세요</h2>
            <div ref={dropdownRef} style={{ width: '80%', position: 'relative' }}>
              <div
                onClick={() => setOpen(!open)}
                style={{
                  padding: 12,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 8,
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: selected ? textColor : lightTextColor,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  transition: 'border-color 0.3s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = primaryColor}
                onMouseOut={(e) => e.currentTarget.style.borderColor = borderColor}
              >
                {selected || '동아리를 선택하세요'}
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill={lightTextColor}>
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </div>
              {open && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 5px)',
                  left: 0,
                  width: '100%',
                  border: `1px solid ${borderColor}`,
                  backgroundColor: '#fff',
                  zIndex: 10,
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  maxHeight: 200,
                  overflowY: 'auto',
                }}>
                  {groups.map(group => (
                    <div
                      key={group}
                      onClick={() => {
                        setSelectedGroup(group);
                        setSelected(group);
                        setStep('adminDashboard');
                        setOpen(false);
                      }}
                      style={{
                        padding: 10,
                        cursor: 'pointer',
                        borderBottom: `1px solid ${secondaryColor}`,
                        color: textColor,
                        textAlign: 'left',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = secondaryColor}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      {group}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'memberGroupSelect' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: 30, color: textColor }}>소속 동아리를 선택하세요</h2>
            <div ref={dropdownRef} style={{ width: '80%', position: 'relative' }}>
              <div
                onClick={() => setOpen(!open)}
                style={{
                  padding: 12,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 8,
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: selected ? textColor : lightTextColor,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  transition: 'border-color 0.3s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = primaryColor}
                onMouseOut={(e) => e.currentTarget.style.borderColor = borderColor}
              >
                {selected || '동아리를 선택하세요'}
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill={lightTextColor}>
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </div>
              {open && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 5px)',
                  left: 0,
                  width: '100%',
                  border: `1px solid ${borderColor}`,
                  backgroundColor: '#fff',
                  zIndex: 10,
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  maxHeight: 200,
                  overflowY: 'auto',
                }}>
                  {groups.map(group => (
                    <div
                      key={group}
                      onClick={() => {
                        setSelectedGroup(group);
                        setSelected(group);
                        setStep('memberDashboard');
                        setOpen(false);
                        // 회원 모드로 진입 시 첫 탭을 'dashboard'로 설정
                        setActiveMemberTab('dashboard');
                        setActiveCommunityTab('feed'); // 커뮤니티 탭 초기화
                      }}
                      style={{
                        padding: 10,
                        cursor: 'pointer',
                        borderBottom: `1px solid ${secondaryColor}`,
                        color: textColor,
                        textAlign: 'left',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = secondaryColor}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      {group}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'adminDashboard' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            paddingTop: 60,
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: 30, color: textColor }}>{selectedGroup} 관리자 페이지</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15, width: '80%' }}>
              <button
                onClick={() => setStep('memberList')}
                style={primaryButtonStyle}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6ab182'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                회원 목록
              </button>
              <button
                onClick={() => setStep('attendanceCheck')}
                style={primaryButtonStyle}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6ab182'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                출석 체크
              </button>
              <button
                onClick={() => setStep('feeManagement')}
                style={primaryButtonStyle}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6ab182'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                회비 관리
              </button>
            </div>
          </div>
        )}

        {/* 회원 대시보드 및 하위 탭 화면 */}
        {step === 'memberDashboard' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            paddingTop: 60, // 상단 로고/뒤로가기 공간
          }}>
            {/* 상단 제목 */}
            {activeMemberTab === 'dashboard' && (
              <h2 style={{ textAlign: 'center', marginBottom: 30, color: textColor }}>{selectedGroup} 회원 페이지</h2>
            )}
            {activeMemberTab === 'community' && activeCommunityTab === 'feed' && (
              <h2 style={{ textAlign: 'center', marginBottom: 20, color: textColor }}> 동아리 피드</h2>
            )}
            {activeMemberTab === 'community' && activeCommunityTab === 'board' && (
              <h2 style={{ textAlign: 'center', marginBottom: 20, color: textColor }}>동아리 커뮤니티 게시판</h2>
            )}


            {/* 컨텐츠 영역 (탭에 따라 달라짐) */}
            <div style={{
              flexGrow: 1, // 남은 공간을 모두 차지
              width: '100%',
              overflowY: 'auto', // 내용이 길어지면 스크롤
              paddingBottom: 70, // 하단 탭 바 공간 확보
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center', // 가로 중앙 정렬
            }}>
              {activeMemberTab === 'dashboard' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 15, width: '80%' }}>
                  <button
                    onClick={() => setStep('memberAttendance')}
                    style={primaryButtonStyle}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6ab182'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    나의 출석 현황
                  </button>
                  <button
                    onClick={() => setStep('memberDues')}
                    style={primaryButtonStyle}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6ab182'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    나의 회비 현황
                  </button>
                  <button
                    onClick={() => setStep('memberInfo')}
                    style={primaryButtonStyle}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6ab182'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    나의 정보
                  </button>
                  <button
                    onClick={() => setStep('accountStatement')}
                    style={primaryButtonStyle}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6ab182'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    동아리 회비 계좌 열람
                  </button>
                </div>
              )}

              {/* **** 커뮤니티 탭 내부 콘텐츠 **** */}
              {activeMemberTab === 'community' && (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* 커뮤니티 내부 탭 바 */}
                  <div style={{
                    display: 'flex',
                    width: '100%',
                    borderBottom: `1px solid ${borderColor}`,
                    marginBottom: 10,
                  }}>
                    <button
                      onClick={() => setActiveCommunityTab('feed')}
                      style={{
                        ...commonButtonStyle,
                        backgroundColor: activeCommunityTab === 'feed' ? primaryColor : secondaryColor,
                        color: activeCommunityTab === 'feed' ? 'white' : textColor,
                        border: 'none',
                        borderRadius: '0',
                        flex: 1,
                        fontSize: 15,
                        padding: '12px 0',
                        transition: 'background-color 0.2s ease, color 0.2s ease',
                      }}
                    >
                      피드
                    </button>
                    <button
                      onClick={() => setActiveCommunityTab('board')}
                      style={{
                        ...commonButtonStyle,
                        backgroundColor: activeCommunityTab === 'board' ? primaryColor : secondaryColor,
                        color: activeCommunityTab === 'board' ? 'white' : textColor,
                        border: 'none',
                        borderRadius: '0',
                        flex: 1,
                        fontSize: 15,
                        padding: '12px 0',
                        transition: 'background-color 0.2s ease, color 0.2s ease',
                      }}
                    >
                      게시판
                    </button>
                  </div>

                  {/* 피드 화면 */}
                  {activeCommunityTab === 'feed' && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 20,
                      width: '100%',
                      padding: '10px 0',
                    }}>
                      {feedPosts.length === 0 ? (
                        <p style={{ textAlign: 'center', color: lightTextColor, marginTop: 20 }}>피드 게시물이 없습니다.</p>
                      ) : (
                        feedPosts.map(post => (
                          <div
                            key={post.id}
                            style={{
                              backgroundColor: 'white',
                              borderRadius: 10,
                              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                              width: '90%',
                              maxWidth: 380,
                              overflow: 'hidden',
                              border: `1px solid ${borderColor}`,
                            }}
                          >
                            <img
                              src={post.image}
                              alt={post.caption}
                              style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                            <div style={{ padding: 15 }}>
                              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                                <button
                                  onClick={() => handleLikeToggle(post.id)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: post.liked ? dangerColor : lightTextColor,
                                    fontSize: 24,
                                    marginRight: 8,
                                  }}
                                >
                                  {post.liked ? '❤️' : '🤍'}
                                </button>
                                <span style={{ color: lightTextColor, fontSize: 14 }}>좋아요 {post.likes}개</span>
                              </div>
                              <p style={{ color: textColor, fontSize: 15, lineHeight: '1.4' }}>
                                {post.caption}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* 게시판 화면 */}
                  {activeCommunityTab === 'board' && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      height: '100%',
                      padding: '10px 0',
                      alignItems: 'center',
                    }}>
                      <button
                        onClick={handleWritePost}
                        style={{
                          ...primaryButtonStyle,
                          width: '80%',
                          marginBottom: 20,
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6ab182'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        글 작성
                      </button>
                      <div style={{
                        width: '100%',
                        flexGrow: 1,
                        overflowY: 'auto',
                        borderTop: `1px solid ${borderColor}`, // 게시판 리스트 시작점
                        paddingTop: 10,
                      }}>
                        {posts.length === 0 ? (
                          <p style={{ textAlign: 'center', color: lightTextColor, marginTop: 20 }}>게시글이 없습니다.</p>
                        ) : (
                          posts.map(post => (
                            <div
                              key={post.id}
                              onClick={() => handlePostClick(post)}
                              style={{
                                padding: '15px 10px',
                                borderBottom: `1px solid ${secondaryColor}`,
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'background-color 0.2s ease',
                                backgroundColor: 'white',
                                borderRadius: 8,
                                marginBottom: 10,
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                              }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f2f2f2'}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                            >
                              <h3 style={{ color: primaryColor, marginBottom: 5, fontSize: 18 }}>{post.title}</h3>
                              <p style={{ color: lightTextColor, fontSize: 12, marginBottom: 10 }}>
                                {post.author} | {post.date}
                              </p>
                              <p style={{ color: textColor, fontSize: 14, maxHeight: 40, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {post.content}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* ********************************* */}
            </div>

            {/* **** 하단 탭 바 (회원 대시보드 공통) **** */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              backgroundColor: 'white',
              borderTop: `1px solid ${borderColor}`,
              boxShadow: '0 -4px 15px rgba(0,0,0,0.05)',
              zIndex: 50,
            }}>
              <button
                onClick={() => {
                  setActiveMemberTab('dashboard');
                  setActiveCommunityTab('feed'); // 커뮤니티 탭 상태 초기화
                }}
                style={{
                  ...commonButtonStyle,
                  backgroundColor: activeMemberTab === 'dashboard' ? primaryColor : 'white',
                  color: activeMemberTab === 'dashboard' ? 'white' : lightTextColor,
                  border: 'none',
                  borderRadius: 0,
                  flex: 1,
                  fontSize: 15,
                  padding: '15px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill={activeMemberTab === 'dashboard' ? 'white' : lightTextColor}>
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
                회원 페이지
              </button>
              <button
                onClick={() => {
                  setActiveMemberTab('community');
                  setActiveCommunityTab('feed'); // 커뮤니티 진입 시 피드 탭을 기본으로
                }}
                style={{
                  ...commonButtonStyle,
                  backgroundColor: activeMemberTab === 'community' ? primaryColor : 'white',
                  color: activeMemberTab === 'community' ? 'white' : lightTextColor,
                  border: 'none',
                  borderRadius: 0,
                  flex: 1,
                  fontSize: 15,
                  padding: '15px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill={activeMemberTab === 'community' ? 'white' : lightTextColor}>
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                </svg>
                커뮤니티
              </button>
            </div>
            {/* ********************************* */}
          </div>
        )}

        {/* 출석 체크 화면 (관리자용) */}
        {step === 'attendanceCheck' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            paddingTop: 60,
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: 20, color: textColor }}>{selectedGroup} 출석 체크</h2>
            <div style={{ overflowX: 'auto', width: '100%', flexGrow: 1 }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '360px',
              }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${primaryColor}`, backgroundColor: secondaryColor }}>
                    <th style={{ padding: '7px 2px', textAlign: 'left', color: textColor, width: '25%', whiteSpace: 'nowrap', fontSize: '0.85em' }}>이름</th>
                    {dates.map(date => (
                      <th key={date} style={{ padding: '7px 2px', color: textColor, fontSize: '0.7em', width: 'auto', whiteSpace: 'nowrap' }}>
                        {date.substring(5).replace('-', '/')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {members.map(member => (
                    <tr key={member.id} style={{ borderBottom: `1px solid ${borderColor}` }}>
                      <td style={{ padding: '5px 2px', color: textColor, fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: '0.8em' }}>{member.name}</td>
                      {dates.map(date => {
                        const key = `${member.id}-${date}`;
                        return (
                          <td
                            key={key}
                            style={{
                              padding: '4px 2px',
                              textAlign: 'center',
                              backgroundColor: attendance[key] ? successColor : dangerColor,
                              color: 'white',
                              borderRadius: 5,
                              transition: 'background-color 0.2s ease',
                              minWidth: '48px',
                              fontSize: '0.7em',
                            }}
                            onClick={() => toggleAttendance(member.id, date)}
                            onMouseOver={(e) => e.currentTarget.style.opacity = 0.8}
                            onMouseOut={(e) => e.currentTarget.style.opacity = 1}
                          >
                            {attendance[key] ? 'O' : 'X'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 회원 목록 화면 (관리자용) */}
        {step === 'memberList' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            paddingTop: 60,
            overflowX: 'auto',
            boxSizing: 'border-box',
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: 20, color: textColor }}>{selectedGroup} 회원 목록</h2>
            <div style={{ overflowX: 'auto', width: '100%', flexGrow: 1 }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: 'auto',
              }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${primaryColor}`, backgroundColor: secondaryColor }}>
                    <th style={{ textAlign: 'left', padding: '12px 5px', color: textColor, width: '20%' }}>이름</th>
                    <th style={{ textAlign: 'left', padding: '12px 5px', color: textColor, width: '25%', fontSize: '0.9em' }}>학과</th>
                    <th style={{ textAlign: 'left', padding: '12px 5px', color: textColor, width: '25%', fontSize: '0.9em' }}>학번</th>
                    <th style={{ textAlign: 'left', padding: '12px 5px', color: textColor, width: '20%', fontSize: '0.9em' }}>전화번호</th>
                    <th style={{ padding: '12px 5px', width: '10%', color: textColor }}>이력서</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(member => (
                    <tr key={member.id} style={{ borderBottom: `1px solid ${borderColor}` }}>
                      <td style={{ padding: '10px 5px', color: textColor, fontWeight: 'bold', whiteSpace: 'nowrap' }}>{member.name}</td>
                      <td style={{ padding: '10px 5px', color: lightTextColor, fontSize: '0.85em', whiteSpace: 'nowrap' }}>{member.department}</td>
                      <td style={{ padding: '10px 5px', color: lightTextColor, fontSize: '0.85em', whiteSpace: 'nowrap' }}>{member.studentId}</td>
                      <td style={{ padding: '10px 5px', color: lightTextColor, fontSize: '0.85em', whiteSpace: 'nowrap' }}>{member.phone}</td>
                      <td style={{ padding: '10px 5px', textAlign: 'center' }}>
                        <button
                          onClick={() => setSelectedResume(member)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '0 auto',
                          }}
                          aria-label="이력서 보기"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill={lightTextColor}>
                            <path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM14 3.5V9h5.5L14 3.5zM8 13h8v2H8v-2zm0 4h8v2H8v-2z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 이력서 보기 팝업 (관리자용) */}
        {selectedResume && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.3s forwards',
          }}>
            <div style={{
              background: '#fff',
              padding: 30,
              borderRadius: 10,
              width: 350,
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
              textAlign: 'left',
              position: 'relative',
            }}>
              <h2 style={{ marginBottom: 20, color: primaryColor, borderBottom: `2px solid ${secondaryColor}`, paddingBottom: 10 }}>{selectedResume.name}님의 이력서</h2>
              <p style={{ marginBottom: 10, color: textColor }}><strong>학과:</strong> {selectedResume.department}</p>
              <p style={{ marginBottom: 10, color: textColor }}><strong>학번:</strong> {selectedResume.studentId}</p>
              <p style={{ marginBottom: 10, color: textColor }}><strong>전화번호:</strong> {selectedResume.phone}</p>
              <p style={{ marginTop: 20, color: lightTextColor, lineHeight: '1.5' }}><strong>이력 내용:</strong> {selectedResume.resume || '이력 내용 없음.'}</p>
              <button
                onClick={() => setSelectedResume(null)}
                style={{
                  ...primaryButtonStyle,
                  width: '100%',
                  marginTop: 30,
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6ab182'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                닫기
              </button>
            </div>
          </div>
        )}

        {/* 회비 관리 화면 (관리자용) */}
        {step === 'feeManagement' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            paddingTop: 60,
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: 20, color: textColor }}>{selectedGroup} 회비 관리</h2>
            <div style={{ overflowX: 'auto', width: '100%', flexGrow: 1 }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '380px',
              }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${primaryColor}`, backgroundColor: secondaryColor }}>
                    <th style={{ padding: '7px 2px', textAlign: 'left', color: textColor, width: '25%', whiteSpace: 'nowrap', fontSize: '0.85em' }}>이름</th>
                    {dates.map(date => (
                      <th key={date} style={{ padding: '7px 2px', color: textColor, fontSize: '0.7em', width: 'auto', whiteSpace: 'nowrap' }}>
                        {date.substring(5).replace('-', '/')}
                      </th>
                    ))}
                    <th style={{ padding: '7px 2px', color: textColor, width: '10%', minWidth: '48px', fontSize: '0.75em' }}>알림</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(member => (
                    <tr key={member.id} style={{ borderBottom: `1px solid ${borderColor}` }}>
                      <td style={{ padding: '5px 2px', color: textColor, fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: '0.8em' }}>{member.name}</td>
                      {dates.map(date => {
                        const key = `${member.id}-${date}`;
                        return (
                          <td key={key} style={{ padding: '4px 2px', textAlign: 'center' }}>
                            <input
                              type="number"
                              value={dues[key] || ''}
                              onChange={(e) => updateDues(member.id, date, e.target.value)}
                              style={{
                                width: '50px',
                                padding: '3px 2px',
                                textAlign: 'right',
                                border: `1px solid ${borderColor}`,
                                borderRadius: 5,
                                outline: 'none',
                                fontSize: '0.7em',
                              }}
                              onFocus={(e) => e.target.style.borderColor = primaryColor}
                              onBlur={(e) => e.target.style.borderColor = borderColor}
                              placeholder="₩"
                            />
                          </td>
                        );
                      })}
                      <td style={{ padding: '4px 2px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleNotify(member.name)}
                          style={{
                            cursor: 'pointer',
                            background: 'none',
                            border: 'none',
                            fontSize: 16,
                            color: dangerColor,
                            padding: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '0 auto',
                            transition: 'transform 0.2s ease',
                          }}
                          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          title="회비 미납 알림 전송"
                        >
                          🔔
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 기존 회비 관리 화면 하단 거래 내역 (부원 이름 노출) */}
            <div style={{ marginTop: 30, paddingTop: 20, borderTop: `1px solid ${borderColor}`, width: '100%', textAlign: 'left' }}>
              <h3 style={{ marginBottom: 15, color: textColor }}>회비 계좌 거래 내역 (관리자용 상세)</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${borderColor}`, backgroundColor: secondaryColor }}>
                    <th style={{ textAlign: 'left', padding: '10px 8px', color: textColor }}>회원명</th>
                    <th style={{ textAlign: 'right', padding: '10px 8px', color: textColor }}>입금액/지출액 (₩)</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((record, index) => (
                    <tr key={index} style={{ borderBottom: `1px solid ${secondaryColor}` }}>
                      <td style={{ padding: '8px 8px', color: record.type === 'expense' ? dangerColor : lightTextColor }}>
                        {record.type === 'expense' ? record.name : `회원 ${index + 1}`}
                      </td>
                      <td style={{ padding: '8px 8px', textAlign: 'right', color: record.type === 'expense' ? dangerColor : textColor }}>
                        {record.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ fontWeight: 'bold', borderTop: `2px solid ${primaryColor}`, backgroundColor: secondaryColor }}>
                    <td style={{ padding: '12px 8px', color: textColor }}>총 잔액</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', color: primaryColor, fontSize: 18 }}>{totalBalance.toLocaleString()} ₩</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 동아리 회비 계좌 열람 화면 (회원용으로 이동, 익명 처리) */}
        {step === 'accountStatement' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            paddingTop: 60,
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: 20, color: textColor }}>{selectedGroup} 동아리 회비 계좌 열람</h2>
            <div style={{ overflowX: 'auto', width: '100%', flexGrow: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${primaryColor}`, backgroundColor: secondaryColor }}>
                    <th style={{ textAlign: 'left', padding: '10px 8px', color: textColor }}>거래 내역</th>
                    <th style={{ textAlign: 'right', padding: '10px 8px', color: textColor }}>금액 (₩)</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((record, index) => (
                    <tr key={index} style={{ borderBottom: `1px solid ${secondaryColor}` }}>
                      <td style={{ padding: '8px 8px', color: record.type === 'expense' ? dangerColor : lightTextColor }}>
                        {record.type === 'expense' ? record.name : `회원 ${index + 1}`}
                      </td>
                      <td style={{ padding: '8px 8px', textAlign: 'right', color: record.type === 'expense' ? dangerColor : textColor }}>
                        {record.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ fontWeight: 'bold', borderTop: `2px solid ${primaryColor}`, backgroundColor: secondaryColor }}>
                    <td style={{ padding: '12px 8px', color: textColor }}>총 잔액</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', color: primaryColor, fontSize: 18 }}>{totalBalance.toLocaleString()} ₩</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 나의 출석 현황 화면 (회원용) */}
        {step === 'memberAttendance' && currentMember && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            paddingTop: 60,
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: 20, color: textColor }}>{selectedGroup} 나의 출석 현황</h2>
            <div style={{
              overflowX: 'auto',
              width: '100%',
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '300px',
              }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${primaryColor}`, backgroundColor: secondaryColor }}>
                    <th style={{ padding: '7px 2px', textAlign: 'left', color: textColor, width: '25%', whiteSpace: 'nowrap', fontSize: '0.85em' }}>이름</th>
                    {dates.map(date => (
                      <th key={date} style={{ padding: '7px 2px', color: textColor, fontSize: '0.7em', width: 'auto', whiteSpace: 'nowrap' }}>
                        {date.substring(5).replace('-', '/')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr key={currentMember.id} style={{ borderBottom: `1px solid ${borderColor}` }}>
                    <td style={{ padding: '5px 2px', color: textColor, fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: '0.8em' }}>{currentMember.name}</td>
                    {dates.map(date => {
                      const key = `${currentMember.id}-${date}`;
                      return (
                        <td
                          key={key}
                          style={{
                            padding: '4px 2px',
                            textAlign: 'center',
                            backgroundColor: attendance[key] ? successColor : dangerColor,
                            color: 'white',
                            borderRadius: 5,
                            minWidth: '48px',
                            fontSize: '0.7em',
                          }}
                        >
                          {attendance[key] ? 'O' : 'X'}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
            <button
                onClick={handleMemberAttendanceCheck}
                style={{
                    ...primaryButtonStyle,
                    width: '80%',
                    marginTop: 30,
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6ab182'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                출석 체크!
            </button>
          </div>
        )}

        {/* 나의 회비 현황 화면 (회원용) */}
        {step === 'memberDues' && currentMember && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            paddingTop: 60,
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: 20, color: textColor }}>{selectedGroup} 나의 회비 현황</h2>
            <div style={{ overflowX: 'auto', width: '100%', flexGrow: 1 }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '300px',
              }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${primaryColor}`, backgroundColor: secondaryColor }}>
                    <th style={{ padding: '7px 2px', textAlign: 'left', color: textColor, width: '25%', whiteSpace: 'nowrap', fontSize: '0.85em' }}>이름</th>
                    {dates.map(date => (
                      <th key={date} style={{ padding: '7px 2px', color: textColor, fontSize: '0.7em', width: 'auto', whiteSpace: 'nowrap' }}>
                        {date.substring(5).replace('-', '/')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr key={currentMember.id} style={{ borderBottom: `1px solid ${borderColor}` }}>
                    <td style={{ padding: '5px 2px', color: textColor, fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: '0.8em' }}>{currentMember.name}</td>
                    {dates.map(date => {
                      const key = `${currentMember.id}-${date}`;
                      return (
                        <td key={key} style={{ padding: '4px 2px', textAlign: 'center', fontSize: '0.75em' }}>
                          {dues[key] ? dues[key].toLocaleString() : 0} ₩
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 30, paddingTop: 20, borderTop: `1px solid ${borderColor}`, width: '100%', textAlign: 'left' }}>
              <h3 style={{ marginBottom: 15, color: textColor }}>총 납부액</h3>
              <p style={{ color: primaryColor, fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
                {paymentHistory.find(p => p.name === currentMember.name)?.amount.toLocaleString() || 0} ₩
              </p>
            </div>
          </div>
        )}

        {/* 나의 정보 화면 (회원용) */}
        {step === 'memberInfo' && currentMember && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            paddingTop: 60,
          }}>
            <h2 style={{ marginBottom: 30, color: textColor }}>{currentMember.name}님의 정보</h2>
            <div style={{
              backgroundColor: '#f9f9f9',
              padding: 25,
              borderRadius: 10,
              width: '80%',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              textAlign: 'left',
            }}>
              <p style={{ marginBottom: 10, color: textColor }}><strong>이름:</strong> {currentMember.name}</p>
              <p style={{ marginBottom: 10, color: textColor }}><strong>학과:</strong> {currentMember.department}</p>
              <p style={{ marginBottom: 10, color: textColor }}><strong>학번:</strong> {currentMember.studentId}</p>
              <p style={{ marginBottom: 10, color: textColor }}><strong>전화번호:</strong> {currentMember.phone}</p>
              <p style={{ marginTop: 20, color: lightTextColor, lineHeight: '1.5' }}><strong>이력 내용:</strong> {currentMember.resume || '이력 내용 없음.'}</p>
            </div>
          </div>
        )}

        {/* **** 게시글 상세 화면 **** */}
        {step === 'viewPost' && selectedPost && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            paddingTop: 60,
            alignItems: 'center',
            textAlign: 'left',
          }}>
            <h2 style={{ color: primaryColor, marginBottom: 10, width: '90%' }}>{selectedPost.title}</h2>
            <p style={{ color: lightTextColor, fontSize: 14, marginBottom: 20, width: '90%', borderBottom: `1px solid ${borderColor}`, paddingBottom: 10 }}>
              {selectedPost.author} | {selectedPost.date}
            </p>
            <div style={{
              backgroundColor: '#f9f9f9',
              padding: 20,
              borderRadius: 10,
              width: '90%',
              minHeight: 150,
              marginBottom: 20,
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              overflowY: 'auto',
              lineHeight: '1.6',
              color: textColor,
            }}>
              {selectedPost.content}
            </div>

            <h3 style={{ color: textColor, marginBottom: 10, width: '90%' }}>댓글</h3>
            <div style={{
              width: '90%',
              maxHeight: 150,
              overflowY: 'auto',
              marginBottom: 15,
              border: `1px solid ${borderColor}`,
              borderRadius: 8,
              padding: 10,
            }}>
              {selectedPost.comments.length === 0 ? (
                <p style={{ color: lightTextColor, textAlign: 'center' }}>댓글이 없습니다.</p>
              ) : (
                selectedPost.comments.map(comment => (
                  <div key={comment.id} style={{ borderBottom: `1px dashed ${secondaryColor}`, paddingBottom: 8, marginBottom: 8 }}>
                    <p style={{ fontSize: 13, color: textColor }}><strong>{comment.author}</strong>: {comment.content}</p>
                    <p style={{ fontSize: 10, color: lightTextColor, textAlign: 'right' }}>{comment.date}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={(e) => handleCommentSubmit(e, selectedPost.id)} style={{ width: '90%', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <textarea
                name="commentContent"
                placeholder="댓글을 입력하세요..."
                rows="3"
                style={{
                  width: '100%',
                  padding: 10,
                  fontSize: 14,
                  borderRadius: 8,
                  border: `1px solid ${borderColor}`,
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = primaryColor}
                onBlur={(e) => e.target.style.borderColor = borderColor}
              ></textarea>
              <button
                type="submit"
                style={{
                  ...primaryButtonStyle,
                  width: '100%',
                  padding: '8px 15px',
                  fontSize: 14,
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6ab182'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                댓글 작성
              </button>
            </form>
          </div>
        )}

        {/* **** 게시글 작성 화면 **** */}
        {step === 'writePost' && showWriteForm && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            paddingTop: 60,
            alignItems: 'center',
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: 20, color: textColor }}>새 게시글 작성</h2>
            <form onSubmit={handlePostSubmit} style={{ width: '80%', display: 'flex', flexDirection: 'column', gap: 15 }}>
              <input
                type="text"
                name="postTitle"
                placeholder="제목을 입력하세요"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = primaryColor}
                onBlur={(e) => e.target.style.borderColor = borderColor}
              />
              <textarea
                name="postContent"
                placeholder="내용을 입력하세요..."
                rows="10"
                style={{
                  ...inputStyle,
                  minHeight: 150,
                  resize: 'vertical',
                }}
                onFocus={(e) => e.target.style.borderColor = primaryColor}
                onBlur={(e) => e.target.style.borderColor = borderColor}
              ></textarea>
              <button
                type="submit"
                style={{
                  ...primaryButtonStyle,
                  width: '100%',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6ab182'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                게시글 등록
              </button>
            </form>
          </div>
        )}
        {/* ********************************* */}

        {/* 공용 팝업 메시지 (자동 사라짐, 클릭해도 닫히지 않음 - 3초 후 사라짐) */}
        {popupMessage && (
          <div
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999,
              animation: 'fadeInOut 3s forwards' // 3초 후 자동으로 사라지게
            }}
          >
            <div style={{
              backgroundColor: 'white',
              padding: '20px 30px',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              fontSize: 16,
              fontWeight: 'bold',
              color: '#333',
              userSelect: 'none',
              textAlign: 'center',
              maxWidth: 300,
            }}>
              {popupMessage}
            </div>
          </div>
        )}

        {/* 애니메이션 스타일 */}
        <style>
          {`
            @keyframes fadeInOut {
              0% { opacity: 0; transform: translateY(-20px); }
              10%, 90% { opacity: 1; transform: translateY(0); }
              100% { opacity: 0; transform: translateY(-20px); }
            }
<<<<<<< HEAD
            @keyframes fadeIn { /* 이 부분은 사용되지 않을 수 있지만 혹시 몰라 유지 */
              from { opacity: 0; }
              to { opacity: 1; }
            }
=======
>>>>>>> 6906af549a751a80eba9c2d4cedc8849dabf6186
          `}
        </style>
      </div>
    </div>
  );
}
