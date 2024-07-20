// pages/pdf/[id].js
import { supabase } from '@/lib/supabase';

const PDFPage = async ({params }: { params: { fileName: string } }) => {
  const getFileUrl = async (filePath:string) =>{
    const { data } = await supabase
    .storage
    .from('files')
    .getPublicUrl(filePath);
    return data?.publicUrl;
  }

  const fileUrl = await getFileUrl(params.fileName);

  return (
    <div>
      <h1>معاينة الملف</h1>
      <div id="loading-message">جاري معاينة الملف ... يرجى الانتظار</div>
      <canvas id="pdf-canvas" style={{ display: 'none' }}></canvas>
      <div className="buttons" style={{ display: 'none' }}>
        <div id='buttons-contaier'>
          <button id="prev-page">الصفحة السابقة</button>
          <button id="next-page">الصفحة التالية</button>
        </div>
      </div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js" async defer></script>
      <script async
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              const url = '${fileUrl}';
              const canvas = document.getElementById('pdf-canvas');
              const ctx = canvas.getContext('2d');
              const loadingMessage = document.getElementById('loading-message');
              const buttons = document.querySelector('.buttons');
              let pdfDoc = null;
              let pageNum = 1;

              // تعيين مسار Web Worker
              pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

              // تحميل ملف PDF جزئيًا
              const loadingTask = pdfjsLib.getDocument({ 
                url: url,
                disableAutoFetch: true, disableStream: true,
                rangeChunkSize:64
              });

              loadingTask.promise
                .then(pdf => {
                  pdfDoc = pdf;
                  renderPage(pageNum); // عرض الصفحة الأولى عند التحميل
                })
                .catch(error => console.error('Error loading PDF:', error));

              function renderPage(num) {
                pdfDoc.getPage(num).then(page => {
                  const scale = 1.5;
                  const viewport = page.getViewport({ scale });
                  canvas.height = viewport.height;
                  canvas.width = viewport.width;

                  const renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                  };

                  page.render(renderContext).promise
                    .then(() => {
                      console.log('Page rendered');
                      loadingMessage.style.display = 'none';
                      canvas.style.display = 'block';
                      buttons.style.display = 'flex';
                    })
                    .catch(error => console.error('Error rendering page:', error));
                }).catch(error => console.error('Error getting page:', error));
              }

              // التنقل بين الصفحات
              document.getElementById('prev-page').addEventListener('click', () => {
                if (pageNum <= 1) return;
                pageNum--;
                renderPage(pageNum);
              });

              document.getElementById('next-page').addEventListener('click', () => {
                if (pageNum >= pdfDoc.numPages) return;
                pageNum++;
                renderPage(pageNum);
              });
            });
          `
        }}
      />
      <style>{`
        div {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 20px;
        }
        #loading-message {
          font-size: 18px;
          color: gray;
        }
        canvas {
          max-width: 100%;
          height: auto;
          margin-bottom: 20px;
        }
        .buttons {
          justify-content: space-between;
          width: 100%;
          max-width: 300px;
        }
        button {
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
        }
        #buttons-contaier {
          display: flex;
          flex-direction: row;
        }
      `}</style>
    </div>
  );
};

export default PDFPage;