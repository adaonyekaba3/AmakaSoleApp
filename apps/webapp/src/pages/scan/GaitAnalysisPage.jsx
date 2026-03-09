import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../components/Toast';
import { gaitApi } from '../../api/gait.queries';

function DataRow({ label, value }) {
  return (
    <div className="flex justify-between py-1.5">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

export default function GaitAnalysisPage() {
  const { scanId } = useParams();
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const { show } = useToast();

  const startAnalysis = async () => {
    setAnalyzing(true);
    try {
      await gaitApi.getUploadUrl(scanId);
      await gaitApi.analyzeGait(scanId);

      for (let i = 0; i < 20; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        try {
          const res = await gaitApi.getResults(scanId);
          if (res.data.pronationType !== 'UNKNOWN') {
            setResults(res.data);
            setAnalyzing(false);
            return;
          }
        } catch { /* polling */ }
      }
    } catch {
      show('Analysis failed', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  if (analyzing) return <LoadingSpinner message="Analyzing your gait..." />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900">Gait Analysis</h2>

      {!results ? (
        <Card className="mt-6 text-center py-8">
          <p className="text-gray-600 mb-6">
            Record yourself walking to analyze your gait pattern and pronation type.
          </p>
          <Button onClick={startAnalysis}>Start Gait Analysis</Button>
        </Card>
      ) : (
        <>
          <Card className="mt-6">
            <p className="text-sm font-medium text-gray-600">Pronation Type</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-2xl font-bold text-gray-900">{results.pronationType}</span>
              <Badge label={`${results.confidenceScore}%`} variant="info" />
            </div>
          </Card>

          {results.analysisData && (
            <Card className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Stride Data</h3>
              <DataRow label="Stride Length" value={`${results.analysisData.stride?.stride_length_cm}cm`} />
              <DataRow label="Cadence" value={`${results.analysisData.stride?.cadence_spm} spm`} />
              <DataRow label="Ground Contact" value={`${results.analysisData.stride?.ground_contact_time_ms}ms`} />
              <DataRow label="Symmetry" value={`${results.analysisData.symmetry_index}%`} />
            </Card>
          )}

          <Link to={`/designs/builder?scanId=${scanId}`}>
            <Button className="mt-6">Generate Orthotic with Gait Data</Button>
          </Link>
        </>
      )}
    </div>
  );
}
