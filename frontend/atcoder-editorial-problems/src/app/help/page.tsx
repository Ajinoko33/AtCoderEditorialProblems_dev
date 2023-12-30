'use client';

import { LinkToOutside } from '@/components';
import { Divider, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function Page() {
  return (
    <Typography className='pt-4'>
      <Paragraph>
        AtCoder Editorial Problems(AEP) は、
        <LinkToOutside href='https://atcoder.jp/' iconSize='none'>
          AtCoder
        </LinkToOutside>
        の問題を<Text strong>解説の筆者から</Text>
        検索することができるサービスです。
      </Paragraph>
      <Paragraph>
        自分好みの筆者の解説がある問題を選んで解くことができます!!
      </Paragraph>

      <Divider />

      {/* ======== 使い方 ============================================= */}
      <Title>使い方</Title>
      <Paragraph>
        問題検索ページで、筆者(Writer)を選択して「Search」ボタンを押すと、下に検索結果が表示されます。
      </Paragraph>
      <Paragraph>
        オプションであなたのAtCoderでのユーザID(Your User
        ID)も一緒に入力すると、検索結果にあなたの問題への取り組み状況が反映されます。
      </Paragraph>
      <Paragraph>
        検索結果の問題タイトルをクリックすると、その問題のページが開きます。
      </Paragraph>

      <Divider />

      {/* ======== Q&A ============================================= */}
      <Title>Q&A</Title>
      <Title level={2}>解説の筆者とは？</Title>
      <Paragraph>
        <Text strong>AtCoderの問題の解説を書いた人</Text>
        です。解説の筆者はその問題のWriterや原案者とは限りません。
      </Paragraph>
      <Paragraph>
        このサービスは、各コンテストの解説タブをスクレイピングして筆者情報を収集しています。いろいろあって、
        <Text strong>
          現在は、各問題で最初に&quot;公式&quot;バッジが付いている解説の筆者
        </Text>
        のみを収集しています。（ユーザ解説も含め他の解説も取得できるよう改修予定です）
      </Paragraph>
      <Paragraph>
        なお、初期のコンテストで見られるPDFの解説はサポート対象外です。
      </Paragraph>

      <Title level={2}>difficulty/diffとは？</Title>
      <Paragraph>
        <LinkToOutside
          href='https://kenkoooo.com/atcoder/#/table/'
          iconSize='none'
        >
          AtCoder Problems
        </LinkToOutside>
        で推定されている、問題ごとの難易度の指標です。コンテスト中の提出より算出された「その問題を50%の確率で解けるレートの値」が、その問題のdifficultyと定義されています。詳しくは
        <LinkToOutside
          href='https://pepsin-amylase.hatenablog.com/entry/atcoder-problems-difficulty'
          iconSize='none'
        >
          こちら
        </LinkToOutside>
        。
      </Paragraph>

      <Title level={2}>直近のコンテストはいつ反映されますか？</Title>
      <Paragraph>
        毎週水曜4:00にその週のコンテスト情報を収集しています。収集にはAtCoder
        ProblemsのAPIを使用しているため、そちらの反映がされていなければAEPでも反映されません。取りこぼした問題のために、不定期でより遡った情報収集をしています。
      </Paragraph>

      <Divider />

      {/* ======== 管理者 ============================================= */}
      <Title>管理者</Title>
      <Paragraph>要望やバグ報告などありましたら、ご連絡ください。</Paragraph>
      <Paragraph>
        Ajinoko
        <ul>
          <li>
            X(Twitter):{' '}
            <LinkToOutside
              href='https://twitter.com/Ajinoko33'
              iconSize='small'
            >
              @Ajinoko33
            </LinkToOutside>
          </li>
          <li>
            GitHub:{' '}
            <LinkToOutside href='https://github.com/Ajinoko33' iconSize='small'>
              Ajinoko33
            </LinkToOutside>
          </li>
        </ul>
      </Paragraph>
    </Typography>
  );
}
