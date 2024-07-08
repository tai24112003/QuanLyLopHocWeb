import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import ListQuestion from './ListQuestion';
import { runGetSubjectOptions } from 'api/subject';
import { runGetQuestionDatas } from 'api/question';
import { gridSpacing } from 'store/constant';

const PopupSearchQuestion = ({ chapters, handleClose, open, infoExam }) => {
  const [subjects, setSubjects] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qValue, setQValue] = useState('');
  const [diffValue, setDiffValue] = useState(-1);
  const [chapterValue, setChapterValue] = useState(-1);
  const [search, setSearch] = useState({ q: '' });

  const handleSearch = (e) => {
    setSearch({ q: qValue });
  };

  useEffect(() => {
    if (open) setLoading(true);
    const fetchData = async () => {
      try {
        const searchParams = {
          ...search,
          subject_id: infoExam.subject_id
        };
        if (diffValue !== -1) searchParams.difficult = diffValue;
        if (chapterValue !== -1) searchParams.chapter_id = chapterValue;
        const [questionsData, subjectsData] = await Promise.all([runGetQuestionDatas(searchParams), runGetSubjectOptions()]);

        setData(formatData(questionsData.data));
        setSubjects(subjectsData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [open, search]);

  const formatData = (data) => {
    return data?.reduce((result, question) => {
      let isCommon = question.type_id === 1;
      if (isCommon) {
        let isExits = result.find((item) => item.id === question.common_content_id && item.type_id === 1);
        if (isExits) {
          isExits.questions.push(question);
        } else {
          let commonQuestion = {
            id: question.common_content_id,
            content: question.common_content,
            type_id: 1,
            chapter_id: question.chapter_id,
            difficulty: question.difficulty,
            subject_id: question.subject_id,
            choices: [],
            questions: [],
            canRemove: question.canRemove
          };
          commonQuestion.questions.push(question);
          result.push(commonQuestion);
        }
      } else {
        result.push(question);
      }

      return result;
    }, []);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" sx={{ width: '100vw' }}>
      <DialogTitle sx={{ fontSize: 25, backgroundColor: '#eef2f6' }}>Danh sách câu hỏi</DialogTitle>
      <DialogContent container sx={{ backgroundColor: '#eef2f6', minHeight: '70vh', maxHeight: '70vh' }}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={1} />
          <Grid item xs={4.7}>
            <TextField
              onChange={(e) => {
                setQValue(e.target.value);
              }}
              placeholder="Tìm kiếm nội dung câu hỏi"
              sx={{ width: '100%' }}
            ></TextField>
          </Grid>
          <Grid item xs={2}>
            <Select
              onChange={(e) => {
                setChapterValue(Number(e.target.value));
              }}
              value={chapterValue}
              sx={{ width: '100%' }}
            >
              <MenuItem value={-1}>Chọn chương</MenuItem>
              {chapters?.map((chapter, index) => (
                <MenuItem key={index} value={chapter.id}>
                  {chapter.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={2}>
            <Select
              onChange={(e) => {
                setDiffValue(Number(e.target.value));
              }}
              value={diffValue}
              sx={{ width: '100%' }}
            >
              <MenuItem value={-1}>Chọn độ khó</MenuItem>
              <MenuItem value={1}>Dễ</MenuItem>
              <MenuItem value={2}>Trung bình</MenuItem>
              <MenuItem value={3}>Khó</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={1.35} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
            <Button onClick={handleSearch} variant="contained" color="warning" sx={{ width: '100%' }}>
              Tìm kiếm
            </Button>
          </Grid>
          <Grid item xs={0.85} />
          <Grid item xs={1} />
          <Grid item xs={11}>
            <Typography>
              Có <b>{data.length}</b> kết quả cho "{search.q}"
            </Typography>
          </Grid>
          <Grid item xs={0.8} />
          <Grid item xs={11} sx={{ overflow: 'hidden' }}>
            {(data.length === 0 || loading) && <div style={{ width: 3000, height: 3000 }}></div>}
            {!loading && <ListQuestion infoExam={infoExam} subjects={subjects} listQuestion={data} />}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: '#eef2f6' }}>
        <Button onClick={handleClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupSearchQuestion;
