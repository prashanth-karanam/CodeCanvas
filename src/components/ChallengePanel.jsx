import React from 'react';
import { Trophy, CheckCircle2, Circle, ArrowRight, GraduationCap } from 'lucide-react';
import { CURRICULUM } from '../utils/curriculum';

export function ChallengePanel({ currentLessonIndex, setCurrentLessonIndex, files }) {
  const lesson = CURRICULUM[currentLessonIndex];
  
  // Calculate completed tasks for this specific lesson
  const completedTaskIds = lesson.tasks.filter(t => t.check(files)).map(t => t.id);
  const isLessonComplete = lesson.tasks.length > 0 && completedTaskIds.length === lesson.tasks.length;

  return (
    <div className="challenge-panel" style={{
      width: '100%',
      height: '100%',
      background: 'rgba(10, 12, 16, 0.4)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className="panel-header" style={{ display: 'flex', gap: '8px', color: 'var(--accent-cyan)' }}>
        <GraduationCap size={16} /> 
        <span>LEARNING PATH</span>
      </div>
      
      <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
        <div style={{ marginBottom: '8px', fontSize: '0.8rem', color: 'var(--accent-purple)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Lesson {currentLessonIndex + 1} of {CURRICULUM.length}
        </div>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '12px', fontWeight: '800' }}>
          {lesson.title}
        </h2>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '32px' }}>
          {lesson.description}
        </p>

        {lesson.tasks.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px' }}>
              Your Tasks
            </h3>
            
            {lesson.tasks.map((task, index) => {
              const isDone = completedTaskIds.includes(task.id);
              return (
                <div key={task.id} style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  alignItems: 'flex-start',
                  padding: '12px',
                  background: isDone ? 'rgba(0, 240, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isDone ? 'rgba(0, 240, 255, 0.2)' : 'var(--border-glass)'}`,
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}>
                  {isDone ? (
                    <CheckCircle2 size={20} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  ) : (
                    <Circle size={20} color="var(--border-highlight)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  )}
                  <span style={{ 
                    color: isDone ? 'var(--text-main)' : 'var(--text-muted)',
                    fontSize: '0.95rem',
                    lineHeight: '1.4'
                  }}>
                    {task.text}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {isLessonComplete && lesson.tasks.length > 0 && (
          <button 
            className="btn-primary"
            onClick={() => setCurrentLessonIndex(prev => prev + 1)}
            style={{ 
              marginTop: '32px', 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '8px',
              padding: '16px',
              background: 'linear-gradient(45deg, var(--accent-cyan), #00ff88)',
              color: '#050505',
              fontSize: '1rem',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)'
            }}
          >
            Next Lesson <ArrowRight size={18} />
          </button>
        )}

        {lesson.tasks.length === 0 && (
          <div style={{ marginTop: '32px', textAlign: 'center', color: 'var(--accent-pink)' }}>
            <Trophy size={48} style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Course Completed!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>You are ready for the hackathon.</p>
          </div>
        )}

      </div>
    </div>
  );
}
