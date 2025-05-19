import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [step, setStep] = useState('login');
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null); // 이력서 보기용
  const [attendance, setAttendance] = useState({});
  const [dues, setDues] = useState({});
  const dropdownRef = useRef(null);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    if (popupMessage) {
      const timer = setTimeout(() => setPopupMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [popupMessage]);

  const handleNotify = (memberName) => {
    setPopupMessage(`${memberName}님 회비 미납 알림을 전송했습니다.`);
    setTimeout(() => {
      setPopupMessage('');
    }, 3000);
  };


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

  // 임시 회원 데이터
  const members = [
  { id: 1, name: '조계윤', department: '금융수학과', studentId: '202131943', phone: '010-1111-1111',resume: '성실한 태도로 프로젝트에 임하며 다양한 웹 프로젝트 경험 보유.' },
  { id: 2, name: '강인식', department: '금융수학과', studentId: '202131903', phone: '010-2222-2222',resume: '동아리 회장을 맡아 리더십을 발휘하였고 다양한 행사 기획 경험이 있음.' },
  { id: 3, name: '김현승', department: '금융수학과', studentId: '202031521', phone: '010-3333-3333' },
  { id: 4, name: '이종협', department: '금융수학과', studentId: '202432938', phone: '010-4444-4444' },
  // 더 추가 가능
];
  const dates = ['2024-05-01', '2024-05-08', '2024-05-15']; 

    const paymentHistory = [
    { name: '조계윤', amount: 30000 },
    { name: '강인식', amount: 60000 },
    { name: '김현승', amount: 90000 },
  ];
  const totalBalance = paymentHistory.reduce((sum, record) => sum + record.amount, 0);
  
const toggleAttendance = (memberId, date) => {
  setAttendance(prev => {
    const key = `${memberId}-${date}`;
    const updated = { ...prev, [key]: !prev[key] };
    return updated;
  });
};

  const baseAmounts = {
  1: 10000,
  2: 20000,
  3: 30000,
  4: 0,
};
    
useEffect(() => {
  const initialDues = {};
  members.forEach(member => {
    dates.forEach(date => {
      initialDues[`${member.id}-${date}`] = baseAmounts[member.id] || 0;
    });
  });
  setDues(initialDues);
}, []);


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
    border: '1px solid #ccc',
    borderRadius: 20,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.96)',
    backgroundColor: 'white',
    padding: 20,
    boxSizing: 'border-box',
    overflowY: 'auto',
    position: 'relative'
  };

  const buttonStyle = {
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    border: '1px solid #444',
    backgroundColor: '#eee',
    cursor: 'pointer'
  };

  const goBack = () => {
    if (step === 'roleSelect') setStep('login');
    else if (step === 'adminGroupSelect') setStep('roleSelect');
    else if (step === 'adminDashboard') setStep('adminGroupSelect');
    else if (step === 'memberList' || step === 'attendanceCheck' || step === 'feeManagement') setStep('adminDashboard');
    else if (step === 'resumeView') setStep('memberList');
  };

  const handleLogin = () => {
    if (id && pw) {
      setStep('roleSelect');
    } else {
      alert('아이디와 비밀번호를 입력하세요');
    }
  };

  return (
    <div style={outerContainerStyle}>
      <div style={innerContainerStyle}>

        {step !== 'login' && (
          <button
            onClick={goBack}
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              padding: '6px 10px',
              fontSize: 14,
              cursor: 'pointer',
              borderRadius: 4,
              border: '1px solid #ccc',
              backgroundColor: '#eee'
            }}
          >
            ← 뒤로가기
          </button>
        )}

        {step === 'login' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}>
            <h2>로그인</h2>
            <input
              type="text"
              placeholder="아이디"
              value={id}
              onChange={e => setId(e.target.value)}
              style={{ width: '80%', marginBottom: 10, padding: 8, fontSize: 16 }}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={pw}
              onChange={e => setPw(e.target.value)}
              style={{ width: '80%', marginBottom: 20, padding: 8, fontSize: 16 }}
            />
            <button onClick={handleLogin} style={{ width: '80%', padding: 10, fontSize: 16 }}>
              로그인
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
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: 20 }}>
              모드를 선택하세요!
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
              <button
                onClick={() => setStep('adminGroupSelect')}
                style={buttonStyle}
              >
                관리자 모드
              </button>
              <button
               onClick={() => alert('회원 모드 기능 준비 중입니다.')}
               style={buttonStyle}
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
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: 20 }}>당신의 동아리를 선택하세요</h2>
            <div ref={dropdownRef} style={{ width: '80%', position: 'relative' }}>
              <div
                onClick={() => setOpen(!open)}
                style={{
                  padding: 12,
                  border: '1px solid #444',
                  borderRadius: 8,
                  backgroundColor: '#f9f9f9',
                  cursor: 'pointer'
                }}
              >
                {selected || '동아리를 선택하세요'}
              </div>
              {open && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '100%',
                  border: '1px solid #ccc',
                  backgroundColor: '#fff',
                  zIndex: 10,
                  borderRadius: 8,
                  marginTop: 4,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
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
                        borderBottom: '1px solid #eee'
                      }}
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
          <>
            <h2 style={{ textAlign: 'center' }}>{selectedGroup} 관리자 페이지</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setStep('memberList')}
                style={buttonStyle}
              >
                회원 목록
              </button>
              <button
                onClick={() => setStep('attendanceCheck')}
                style={buttonStyle}
              >
                출석 체크
              </button>
              <button
                onClick={() => setStep('feeManagement')}
                style={buttonStyle}
              >
                회비 관리
              </button>
            </div>
          </>
        )}

                {step === 'attendanceCheck' && (
          <>
            <h2 style={{ textAlign: 'center' }}>{selectedGroup} 출석 체크</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #444' }}>
                  <th style={{ padding: 8 }}>이름</th>
                  {dates.map(date => (
                    <th key={date} style={{ padding: 8 }}>{date}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.id} style={{ borderBottom: '1px solid #ccc' }}>
                    <td style={{ padding: 8 }}>{member.name}</td>
                    {dates.map(date => {
                      const key = `${member.id}-${date}`;
                      return (
                        <td
                          key={key}
                          style={{
                            padding: 8,
                            textAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: attendance[key] ? '#d4edda' : '#f8d7da'
                          }}
                          onClick={() => toggleAttendance(member.id, date)}
                        >
                          {attendance[key] ? '출석' : '결석'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {step === 'memberList' && (
          <>
            <h2 style={{ textAlign: 'center' }}>{selectedGroup} 회원 목록</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #444' }}>
                  <th style={{ textAlign: 'left', padding: 8 }}>이름</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>학과</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>학번</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>전화번호</th>
                  <th style={{ padding: 8, width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.id} style={{ borderBottom: '1px solid #ccc' }}>
                    <td style={{ padding: 8 }}>{member.name}</td>
                    <td style={{ padding: 8 }}>{member.department}</td>
                    <td style={{ padding: 8 }}>{member.studentId}</td>
                    <td style={{ padding: 8 }}>{member.phone}</td>
                    <td style={{ padding: 8, textAlign: 'center' }}>
                      <button
                        onClick={() => setSelectedResume(member)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                        aria-label="이력서 보기"
                      >
                        {/* 문서 아이콘 SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="#555">
                          <path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM14 3.5V9h5.5L14 3.5zM8 13h8v2H8v-2zm0 4h8v2H8v-2z"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {selectedResume && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#fff',
              padding: 20,
              borderRadius: 8,
              width: 400,
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
              <h2>{selectedResume.name}님의 이력서</h2>
              <p><strong>학과:</strong> {selectedResume.department}</p>
              <p><strong>학번:</strong> {selectedResume.studentId}</p>
              <p><strong>전화번호:</strong> {selectedResume.phone}</p>
              <p><strong>이력 내용:</strong> {selectedResume.resume}</p>
              <button
                onClick={() => setSelectedResume(null)}
                style={{ marginTop: 20, padding: '8px 16px', cursor: 'pointer' }}
              >
                닫기
              </button>
            </div>
          </div>
        )}

        

        {step === 'feeManagement' && (
          <>
            <h2 style={{ textAlign: 'center' }}>{selectedGroup} 회비 관리</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #444' }}>
                  <th style={{ padding: 8 }}>이름</th>
                  {dates.map(date => (
                    <th key={date} style={{ padding: 8 }}>{date}</th>
                  ))}
                  <th style={{ padding: 8 }}>알림</th> {/* 알림 버튼 칸 */}
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.id} style={{ borderBottom: '1px solid #ccc' }}>
                    <td style={{ padding: 8 }}>{member.name}</td>
                    {dates.map(date => {
                      const key = `${member.id}-${date}`;
                      return (
                        <td key={key} style={{ padding: 8, textAlign: 'center' }}>
                          <input
                            type="number"
                            value={dues[key] || ''}
                            onChange={(e) => updateDues(member.id, date, e.target.value)}
                            style={{ width: '60px', textAlign: 'right' }}
                            placeholder="₩"
                          />
                        </td>
                      );
                    })}
                    <td style={{ padding: 8, textAlign: 'center' }}>
                      <button
                        onClick={() => handleNotify(member.name)}
                        style={{
                          cursor: 'pointer',
                          background: 'none',
                          border: 'none',
                          fontSize: 20,
                          color: '#ff5722',
                        }}
                        title="회비 미납 알림 전송"
                      >
                        🔔
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 거래 내역 및 잔액 */}
            <div style={{ marginTop: 30, paddingTop: 10, borderTop: '1px solid #ccc' }}>
              <h3>회비 계좌 거래 내역</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #aaa' }}>
                    <th style={{ textAlign: 'left', padding: 8 }}>회원명</th>
                    <th style={{ textAlign: 'right', padding: 8 }}>입금액 (₩)</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map(({ name, amount }) => (
                    <tr key={name} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: 8 }}>{name}</td>
                      <td style={{ padding: 8, textAlign: 'right' }}>{amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr style={{ fontWeight: 'bold', borderTop: '2px solid #444' }}>
                    <td style={{ padding: 8 }}>총 잔액</td>
                    <td style={{ padding: 8, textAlign: 'right' }}>{totalBalance.toLocaleString()} ₩</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* 팝업 메시지 */}
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
              animation: 'fadeInOut 3s forwards'
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

        {/* keyframe 애니메이션 스타일 */}
        <style>
          {`
            @keyframes fadeInOut {
              0% { opacity: 0; transform: translateY(-20px); }
              10%, 90% { opacity: 1; transform: translateY(0); }
              100% { opacity: 0; transform: translateY(-20px); }
            }
          `}
        </style>
      </div>
    </div>
  );
 }